"""Read-only snapshot of the public preview, separate from local test results.
An old or unreachable deployment is recorded, not treated as a code-test failure.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json, re, hashlib
BASE='https://alarmasycamarasrapid.netlify.app'
cssfile=next(Path('dist/assets').glob('css.*.css'))
expected_css='/assets/'+cssfile.name
expected_hash=hashlib.sha256(cssfile.read_bytes()).hexdigest()
def read(url):
    if urlparse(url).netloc!=urlparse(BASE).netloc:
        raise ValueError('External origin not allowed')
    with urlopen(Request(url,headers={'User-Agent':'Rapid-preview-verification','Cache-Control':'no-cache'}),timeout=15) as r:
        if urlparse(r.url).netloc!=urlparse(BASE).netloc:
            raise ValueError('Unexpected redirect')
        raw=r.read(2000001)
        if len(raw)>2000000:raise ValueError('Response too large')
        return raw,r.status

def inspect(route):
    row={'url':BASE+route,'updated':False}
    try:
        raw,status=read(BASE+route);html=raw.decode('utf-8')
        main=re.search(r'<main\b[\s\S]*?</main>',html)
        footer=re.search(r'<footer\b[\s\S]*?</footer>',html)
        photos=re.findall(r'<img\b[^>]*src="([^"]+)"',main[0] if main else '')
        row.update(status=status,photos=len(photos),distinctPhotos=len(set(photos)),footerPhones=len(re.findall(r'href="tel:',footer[0] if footer else '')),expectedStylesheet=expected_css in html)
        local_ok=(route=='/' or ('id="local-ecosystem-title"' in html and 'id="local-usage-title"' in html))
        row['updated']=status==200 and row['expectedStylesheet'] and len(photos)==len(set(photos))==4 and row['footerPhones']==1 and local_ok
    except Exception as error:row['error']=str(error)
    return row
rows=list(ThreadPoolExecutor(max_workers=3).map(inspect,['/','/burgos/lerma/','/bizkaia/zalla/']))
try:
    css,status=read(urljoin(BASE,expected_css))
    css_ok=status==200 and hashlib.sha256(css).hexdigest()==expected_hash
except Exception as error:
    css_ok=False
report={'checkedAt':datetime.now(timezone.utc).isoformat(),'commit':__import__('os').environ.get('GITHUB_SHA'),'expectedStylesheet':expected_css,'stylesheetMatchesBuild':css_ok,'pages':rows,'allUpdated':css_ok and all(r['updated'] for r in rows)}
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/deployment-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('PUBLIC PREVIEW:', 'updated and matching this build' if report['allUpdated'] else 'not confirmed; see deployment-check.json')
