import urllib.request
import re

urls = [
    "https://www.youtube.com/watch?v=zvPyqN-FEPQ",
    "https://www.youtube.com/watch?v=y09GQY2oTlQ"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

for url in urls:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            title_match = re.search(r'<title>(.*?)</title>', html)
            title = title_match.group(1) if title_match else "No Title"
            print(f"URL: {url}")
            print(f"Title: {title}")
    except Exception as e:
        print(f"Error for {url}: {e}")
