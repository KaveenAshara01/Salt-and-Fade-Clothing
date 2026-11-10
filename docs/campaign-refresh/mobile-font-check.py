from pathlib import Path
exec(Path('docs/campaign-refresh/browser-check.py').read_text().split('browser=DevTools()')[0])
b=DevTools()
report={}
for width,label in [(1440,'desktop'),(390,'mobile'),(320,'narrow-mobile')]:
    b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':900 if width>600 else 844,'deviceScaleFactor':1,'mobile':width<600})
    b.call('Page.navigate',{'url':'http://127.0.0.1:5173/'})
    for _ in range(60):
        if b.js("document.querySelector('.campaign-banner--surf') !== null"): break
        time.sleep(.2)
    b.js("document.fonts.load('italic 600 48px Fraunces')")
    b.js("document.querySelector('.campaign-banner--surf img').decode()")
    time.sleep(.3)
    b.screenshot(label+'-editorial-font')
    report[label]=b.js("""(()=>{const i=document.querySelector('.campaign-banner--surf img'),h=document.querySelector('.campaign-banner h1'),c=document.querySelector('.campaign-banner-copy'),button=c.querySelector('a');return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,font:getComputedStyle(h).fontFamily,fontLoaded:document.fonts.check('italic 600 48px Fraunces'),source:i.currentSrc,imageLoaded:i.naturalWidth>0,imageAspect:i.naturalWidth/i.naturalHeight,renderedAspect:i.clientWidth/i.clientHeight,objectFit:getComputedStyle(i).objectFit,copyBottom:button.getBoundingClientRect().bottom-i.getBoundingClientRect().top,bannerHeight:i.clientHeight}})()""")
Path('docs/campaign-refresh/mobile-font-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
