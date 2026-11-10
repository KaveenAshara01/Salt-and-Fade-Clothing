import base64, hashlib, json, os, socket, struct, time, urllib.request
from pathlib import Path

class DevTools:
    def __init__(self):
        targets=json.load(urllib.request.urlopen('http://127.0.0.1:9225/json/list'))
        from urllib.parse import urlparse
        u=urlparse(next(t['webSocketDebuggerUrl'] for t in targets if t['type']=='page'))
        self.sock=socket.create_connection((u.hostname,u.port),timeout=20)
        key=base64.b64encode(os.urandom(16)).decode()
        self.sock.sendall(f'GET {u.path} HTTP/1.1\r\nHost: {u.hostname}:{u.port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'.encode())
        data=b''
        while b'\r\n\r\n' not in data: data+=self.sock.recv(1)
        assert b'101' in data, data
        self.seq=0
        self.errors=[]
    def read(self,n):
        data=b''
        while len(data)<n:
            part=self.sock.recv(n-len(data))
            if not part: raise RuntimeError('Browser socket closed')
            data+=part
        return data
    def call(self,method,params=None):
        self.seq+=1
        payload=json.dumps({'id':self.seq,'method':method,'params':params or {}}).encode()
        mask=os.urandom(4)
        n=len(payload)
        header=bytes([0x81,0x80|n]) if n<126 else bytes([0x81,0xfe])+struct.pack('!H',n) if n<65536 else bytes([0x81,0xff])+struct.pack('!Q',n)
        self.sock.sendall(header+mask+bytes(v^mask[i%4] for i,v in enumerate(payload)))
        while True:
            first,second=self.read(2)
            length=second&127
            if length==126: length=struct.unpack('!H',self.read(2))[0]
            if length==127: length=struct.unpack('!Q',self.read(8))[0]
            data=self.read(length)
            while not first&128:
                first,second=self.read(2); length=second&127
                if length==126: length=struct.unpack('!H',self.read(2))[0]
                if length==127: length=struct.unpack('!Q',self.read(8))[0]
                data+=self.read(length)
            msg=json.loads(data)
            if msg.get('method')=='Runtime.exceptionThrown': self.errors.append(msg['params'])
            if msg.get('id')==self.seq:
                if 'error' in msg: raise RuntimeError(msg['error'])
                return msg.get('result',{})
    def js(self,expression):
        result=self.call('Runtime.evaluate',{'expression':expression,'returnByValue':True,'awaitPromise':True})
        if 'exceptionDetails' in result: raise RuntimeError(result['exceptionDetails'])
        return result['result'].get('value')
    def screenshot(self,name):
        result=self.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})
        Path('docs/campaign-refresh/'+name+'.png').write_bytes(base64.b64decode(result['data']))

browser=DevTools()
browser.call('Page.enable'); browser.call('Runtime.enable')
report={}
for width,height,label in [(1440,1000,'desktop'),(390,844,'mobile')]:
    browser.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':width<600})
    if label == 'desktop': browser.call('Page.navigate',{'url':'http://127.0.0.1:5173/'})
    else: browser.js("window.scrollTo({top:0,behavior:'instant'})")
    for _ in range(40):
        if browser.js("document.querySelector('.campaign-banner') !== null"): break
        time.sleep(.3)
    browser.js("Promise.all([...document.querySelectorAll('.campaign-banner img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}))")
    for _ in range(60):
        if browser.js("document.querySelector('.home-product-rail') !== null"): break
        time.sleep(.3)
    if not browser.js("document.querySelector('.home-product-rail') !== null"):
        browser.call('Page.reload',{'ignoreCache':True})
        for _ in range(80):
            if browser.js("document.querySelector('.home-product-rail') !== null"): break
            time.sleep(.3)
    browser.js("Promise.all([...document.querySelectorAll('.campaign-banner img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}))")
    time.sleep(.5)
    browser.screenshot(label+'-hero')
    report[label]=browser.js("""({width:innerWidth,documentWidth:document.documentElement.scrollWidth, h1:document.querySelectorAll('h1').length, products:document.querySelectorAll('.home-product-rail .sun-product').length,categories:document.querySelectorAll('.collection-discovery-card').length,banners:[...document.querySelectorAll('.campaign-banner')].map(b=>({name:b.className,source:b.querySelector('img').currentSrc,loaded:b.querySelector('img').naturalWidth,heading:b.querySelector('h1,h2')?.innerText})), brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})""")
    for banner in ['volleyball','pool','tennis']:
        browser.js(f"document.querySelector('.campaign-banner--{banner}').scrollIntoView({{behavior:'instant',block:'start'}})")
        time.sleep(.3)
        browser.screenshot(label+'-'+banner)
    browser.js("document.querySelector('.home-product-carousel').scrollIntoView({behavior:'instant',block:'start'})")
    browser.js("Promise.all([...document.querySelectorAll('.home-product-carousel img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}))")
    browser.screenshot(label+'-products')
    before=browser.js("document.querySelector('.home-product-rail')?.scrollLeft")
    browser.js("document.querySelector('.home-carousel-controls button:last-child').click()")
    time.sleep(.8)
    after=browser.js("document.querySelector('.home-product-rail')?.scrollLeft")
    report[label]['carouselMoved']=after>before if before is not None else False
    report[label]['edgeButtonDisabled']=browser.js("document.querySelector('.home-carousel-controls button:first-child').disabled")
report['runtimeErrors']=browser.errors
Path('docs/campaign-refresh/browser-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
