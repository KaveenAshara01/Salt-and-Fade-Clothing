from pathlib import Path
exec(Path('docs/campaign-refresh/browser-check.py').read_text().split('browser=DevTools()')[0])
b=DevTools()
b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
b.call('Page.navigate',{'url':'http://127.0.0.1:5173/'})
for _ in range(40):
    if b.js("document.querySelector('.campaign-banner--surf') !== null"): break
    time.sleep(.2)
b.js("document.fonts.load('italic 600 48px Fraunces')")
b.js("document.querySelector('.campaign-banner--surf img').decode()")
b.screenshot('desktop-editorial-font')
print(b.js("({font:getComputedStyle(document.querySelector('.campaign-banner h1')).fontFamily,loaded:document.fonts.check('italic 600 48px Fraunces'),overflow:document.documentElement.scrollWidth>innerWidth})"))
