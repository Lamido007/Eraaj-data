const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

// ============================================================
// MONNIFY CONFIG — Secret lives here on the server, NEVER in browser
// ============================================================
const MONNIFY = {
  apiKey: "MK_TEST_XCHAZT5E7C",          // Your Monnify API Key
  secretKey: "TADEH4XHQ0QUYLRH743UGA43QZ24SJ78",  // Your Secret Key (SAFE here)
  contractCode: "71113416446",             // Your Contract Code
  baseUrl: "https://sandbox.monnify.com",  // Change to https://api.monnify.com when live
};

// Get Monnify auth token
async function getMonnifyToken() {
  const credentials = Buffer.from(`${MONNIFY.apiKey}:${MONNIFY.secretKey}`).toString("base64");
  const res = await fetch(`${MONNIFY.baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!data.responseBody?.accessToken) throw new Error("Monnify auth failed: " + JSON.stringify(data));
  return data.responseBody.accessToken;
}

// ============================================================
// CLOUD FUNCTION 1: Create Virtual Account for a user
// ============================================================
exports.createVirtualAccount = functions.https.onCall(async (data, context) => {
  // Must be logged in
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");

  const userId = context.auth.uid;
  const userEmail = data.email;
  const userName = data.name;

  if (!userEmail || !userName) {
    throw new functions.https.HttpsError("invalid-argument", "Email and name required");
  }

  try {
    // Check if user already has a virtual account
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data() || {};
    if (userData.virtualAccount?.accountNumber) {
      return { success: true, account: userData.virtualAccount, existing: true };
    }

    const token = await getMonnifyToken();
    const accountRef = "ERAAJ-" + userId.substring(0, 10).toUpperCase();

    const createRes = await fetch(`${MONNIFY.baseUrl}/api/v2/bank-transfer/reserved-accounts`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountReference: accountRef,
        accountName: userName,
        currencyCode: "NGN",
        contractCode: MONNIFY.contractCode,
        customerEmail: userEmail,
        customerName: userName,
        getAllAvailableBanks: false,
        preferredBanks: ["035"],  // Wema Bank — fast and reliable
      }),
    });

    const createData = await createRes.json();

    // If account already exists on Monnify, fetch it
    if (!createRes.ok) {
      const fetchRes = await fetch(
        `${MONNIFY.baseUrl}/api/v2/bank-transfer/reserved-accounts/${accountRef}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      if (!fetchRes.ok) throw new Error(createData.responseMessage || "Could not create account");
      const fetchData = await fetchRes.json();
      const accounts = fetchData.responseBody?.accounts || [];
      if (accounts.length === 0) throw new Error("No accounts returned");

      const va = {
        accountNumber: accounts[0].accountNumber,
        bankName: accounts[0].bankName,
        accountName: fetchData.responseBody.accountName,
        accountReference: accountRef,
        createdAt: new Date().toISOString(),
      };
      await db.collection("users").doc(userId).update({ virtualAccount: va });
      return { success: true, account: va };
    }

    const accounts = createData.responseBody?.accounts || [];
    if (accounts.length === 0) throw new Error("No accounts returned from Monnify");

    const va = {
      accountNumber: accounts[0].accountNumber,
      bankName: accounts[0].bankName,
      accountName: createData.responseBody.accountName,
      accountReference: accountRef,
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    await db.collection("users").doc(userId).update({ virtualAccount: va });
    console.log(`Virtual account created for user ${userId}: ${va.accountNumber}`);
    return { success: true, account: va };

  } catch (err) {
    console.error("createVirtualAccount error:", err);
    throw new functions.https.HttpsError("internal", err.message || "Failed to create account");
  }
});

// ============================================================
// CLOUD FUNCTION 2: Monnify Webhook — auto-credit wallet on payment
// ============================================================
exports.monnifyWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const event = req.body;
    console.log("Monnify webhook received:", JSON.stringify(event));

    // Verify it's a successful payment
    if (event.eventType !== "SUCCESSFUL_TRANSACTION") {
      return res.status(200).send("OK");
    }

    const txData = event.eventData;
    const amount = txData.amountPaid;
    const accountRef = txData.product?.reference; // "ERAAJ-XXXXXXXXXX"
    const monnifyRef = txData.transactionReference;

    if (!accountRef || !accountRef.startsWith("ERAAJ-")) {
      return res.status(200).send("Not an Eraaj transaction");
    }

    // Find user by accountReference
    const usersSnap = await db.collection("users")
      .where("virtualAccount.accountReference", "==", accountRef)
      .limit(1)
      .get();

    if (usersSnap.empty) {
      console.error("No user found for accountRef:", accountRef);
      return res.status(200).send("User not found");
    }

    const userDoc = usersSnap.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    // Check for duplicate (idempotency)
    const dupCheck = await db.collection("transactions")
      .where("apiRef", "==", monnifyRef)
      .limit(1)
      .get();

    if (!dupCheck.empty) {
      console.log("Duplicate webhook, skipping:", monnifyRef);
      return res.status(200).send("Already processed");
    }

    // Credit the wallet
    const newBalance = (userData.balance || 0) + amount;
    await db.collection("users").doc(userId).update({ balance: newBalance });

    // Record transaction
    await db.collection("transactions").add({
      userId,
      type: "fund",
      title: "Bank Transfer",
      detail: `Transfer to virtual account — ${txData.paymentSourceInformation?.[0]?.bankCode || "Bank"}`,
      amount,
      direction: "credit",
      status: "success",
      apiRef: monnifyRef,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Credited ₦${amount} to user ${userId} (${userData.name})`);
    return res.status(200).send("OK");

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Error: " + err.message);
  }
});
