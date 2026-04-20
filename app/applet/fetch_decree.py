import urllib.request
from bs4 import BeautifulSoup
import re

url = "https://luatvietnam.vn/dau-tu/nghi-dinh-24-2024-nd-cp-huong-dan-luat-dau-thau-2023-ve-lua-chon-nha-thau-281816-d1.html"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read()
    soup = BeautifulSoup(html, 'html.parser')
    content = soup.find('div', class_='content-doc') or soup.find('div', id='box-content-doc') or soup.body
    text = content.get_text('\n', strip=True)
    with open('decree.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Success. Saved to decree.txt")
except Exception as e:
    print("Error:", e)
