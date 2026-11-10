from pathlib import Path
prefix=Path('docs/campaign-refresh/browser-check.py').read_text().split('browser=DevTools()')[0]
exec(prefix)
b=DevTools()
b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
checks={}
b.call('Page.navigate',{'url':'http://127.0.0.1:5173/'})
for _ in range(80):
    if b.js("document.querySelector('.home-product-rail') !== null"): break
    time.sleep(.25)
time.sleep(1)
b.js("document.querySelector('.home-product-rail').scrollTo({left:99999,behavior:'instant'})")
time.sleep(.3)
checks['endMetrics']=b.js("(()=>{const r=document.querySelector('.home-product-rail');return {left:r.scrollLeft,width:r.clientWidth,total:r.scrollWidth}})()")
checks['endButtonDisabled']=b.js("document.querySelector('.home-carousel-controls button:last-child').disabled")
b.js("document.querySelector('.home-carousel-controls button:first-child').click()")
time.sleep(.7)
checks['previousMovedBack']=b.js("document.querySelector('.home-product-rail').scrollLeft < document.querySelector('.home-product-rail').scrollWidth - document.querySelector('.home-product-rail').clientWidth - 2")
b.js("document.querySelector('.product-tabs button:nth-child(2)').click()")
time.sleep(.4)
checks['filterSelected']=b.js("document.querySelector('.product-tabs button:nth-child(2)').getAttribute('aria-pressed') === 'true'")
checks['filteredProductCount']=b.js("document.querySelectorAll('.home-product-carousel:first-of-type .sun-product').length || document.querySelector('.home-product-rail')?.children.length")
old=b.js("document.querySelector('.collection-discovery-grid').scrollLeft")
b.js("document.querySelector('.collection-discovery-controls button:last-child').click()")
time.sleep(.7)
checks['categoryRailMoved']=b.js("document.querySelector('.collection-discovery-grid').scrollLeft")>old
b.call('Page.navigate',{'url':'http://127.0.0.1:5173/about'})
for _ in range(30):
    if b.js("document.querySelector('.about-lifestyle-photo') !== null"): break
    time.sleep(.2)
b.js("Promise.all([...document.querySelectorAll('.sun-about img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}))")
checks['aboutUsesOriginals']=b.js("[...document.querySelectorAll('.sun-about img')].every(i=>i.currentSrc.includes('-original.jpg') && i.naturalWidth > 0)")
checks['aboutNoOverflow']=b.js("document.documentElement.scrollWidth <= innerWidth")
checks['runtimeErrors']=b.errors
Path('docs/campaign-refresh/interaction-report.json').write_text(json.dumps(checks,indent=2))
print(json.dumps(checks,indent=2))
