from pathlib import Path
exec(Path('docs/campaign-refresh/browser-check.py').read_text().split('browser=DevTools()')[0])
b=DevTools(); b.call('Page.enable'); b.call('Runtime.enable')
report={}
for width,height,label in [(1440,1000,'desktop'),(390,844,'mobile'),(320,844,'narrow-mobile')]:
    b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':width<600})
    if label=='desktop':
        b.call('Page.navigate',{'url':'http://127.0.0.1:5173/'})
        for attempt in range(2):
            for _ in range(60):
                if b.js("document.querySelector('.home-product-rail') !== null"): break
                time.sleep(.3)
            if b.js("document.querySelector('.home-product-rail') !== null"): break
            b.call('Page.reload',{'ignoreCache':True})
    b.js("window.scrollTo({top:0,behavior:'instant'})")
    b.js("document.fonts.load('italic 600 48px Fraunces')")
    b.js("Promise.race([Promise.all([...document.querySelectorAll('.campaign-home img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})})),new Promise(r=>setTimeout(r,12000))])")
    time.sleep(.5)
    b.screenshot('layout-'+label+'-hero')
    sections=b.js("[...document.querySelector('.campaign-home').children].filter(e=>e.tagName==='SECTION').map(e=>({className:e.className,heading:e.querySelector('h1,h2')?.innerText,top:Math.round(e.getBoundingClientRect().top+scrollY)}))")
    for i,section in enumerate(sections):
        if label=='narrow-mobile' and i not in [1,3,4,6]: continue
        b.js(f"window.scrollTo({{top:{max(0,section['top']-112)},behavior:'instant'}})")
        time.sleep(.2)
        b.screenshot(f'layout-{label}-{i}')
    report[label]=b.js("""(()=>{const rail=document.querySelector('.home-product-rail'),tile=[...document.querySelector('.home-story-tiles').children],root=getComputedStyle(document.documentElement);return {width:innerWidth,noOverflow:document.documentElement.scrollWidth<=innerWidth,sectionOrder:[...document.querySelector('.campaign-home').children].map(e=>e.className),products:document.querySelectorAll('.home-product-rail .sun-product').length,productCardsPerView:rail?Math.round(rail.clientWidth/rail.firstElementChild.getBoundingClientRect().width*100)/100:0,categoryCardsPerView:(()=>{const r=document.querySelector('.collection-discovery-grid');return r?Math.round(r.clientWidth/r.firstElementChild.getBoundingClientRect().width*100)/100:0})(),tilesStacked:tile[1].getBoundingClientRect().top>tile[0].getBoundingClientRect().bottom-1,tileColumns:getComputedStyle(document.querySelector('.home-story-tiles')).gridTemplateColumns,bannerFont:getComputedStyle(document.querySelector('h1')).fontFamily,mobileBanner:document.querySelector('.campaign-banner--surf img').currentSrc,colours:{blue:root.getPropertyValue('--brand-blue').trim(),yellow:root.getPropertyValue('--brand-yellow').trim(),background:root.getPropertyValue('--color-bg').trim()},brokenImages:[...document.querySelectorAll('.campaign-home img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}})()""")
    for name,railSelector,buttonSelector in [('products','.home-product-rail','.home-carousel-controls button:last-child'),('categories','.collection-discovery-grid','.collection-discovery-controls button:last-child'),('activities','.home-lifestyle-rail','.home-lifestyle .home-carousel-controls button:last-child')]:
        before=b.js(f"document.querySelector('{railSelector}')?.scrollLeft")
        disabled=b.js(f"document.querySelector('{buttonSelector}').disabled")
        b.js(f"document.querySelector('{buttonSelector}').click()")
        time.sleep(.6)
        after=b.js(f"document.querySelector('{railSelector}')?.scrollLeft")
        report[label][name+'ControlWorks']=disabled or (after>before)
    b.js("document.querySelector('.product-tabs button:nth-child(2)')?.click()")
    time.sleep(.3)
    report[label]['filterWorks']=b.js("document.querySelector('.product-tabs button:nth-child(2)')?.getAttribute('aria-pressed') === 'true'")
    b.js("document.querySelector('.product-tabs button:first-child')?.click()")
report['runtimeErrors']=b.errors
Path('docs/campaign-refresh/carnage-layout-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
