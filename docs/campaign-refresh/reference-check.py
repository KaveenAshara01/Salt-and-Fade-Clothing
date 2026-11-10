from pathlib import Path
exec(Path('docs/campaign-refresh/browser-check.py').read_text().split('browser=DevTools()')[0])
b=DevTools(); b.call('Page.enable'); b.call('Runtime.enable')
report={}
for width,height,label in [(1440,1000,'desktop'),(390,844,'mobile')]:
    b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':width<600})
    b.call('Page.navigate',{'url':'https://incarnage.com/'})
    for _ in range(60):
        if b.js("document.querySelector('main') !== null"): break
        time.sleep(.5)
    time.sleep(3)
    b.screenshot('reference-'+label+'-top')
    report[label]=b.js("""[...document.querySelectorAll('main > *, main [id^=\"shopify-section-\"]')].map(e=>({id:e.id,tag:e.tagName,heading:e.querySelector('h1,h2,h3')?.innerText,top:Math.round(e.getBoundingClientRect().top+scrollY),height:Math.round(e.getBoundingClientRect().height),width:Math.round(e.getBoundingClientRect().width),images:e.querySelectorAll('img').length})).filter(e=>e.height>10)""")
    for i,section in enumerate(report[label]):
        if section['height']>10:
            b.js(f"window.scrollTo({{top:{section['top']},behavior:'instant'}})")
            time.sleep(.6)
            b.screenshot(f'reference-{label}-{i}')
    report[label+'-text']=b.js("document.querySelector('main').innerText.slice(0,5000)")
Path('docs/campaign-refresh/reference-layout.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
