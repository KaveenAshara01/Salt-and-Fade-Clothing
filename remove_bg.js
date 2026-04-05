const jimpPackage = require('jimp');
const Jimp = jimpPackage.Jimp || jimpPackage; // Handle v1 vs v0

// In newer jimp (v1+), there is no 'jimp.read'. We use Jimp.read.
const run = async () => {
    let image;
    try {
        if(Jimp.read) {
           image = await Jimp.read('frontend/public/images/logo.jpg');
        } else {
           // Maybe it's a different export
           image = await jimpPackage.read('frontend/public/images/logo.jpg');
        }
        
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        
        for(let y = 0; y < height; y++) {
          for(let x = 0; x < width; x++) {
            const hex = image.getPixelColor(x, y);
            const rgba = jimpPackage.intToRGBA ? jimpPackage.intToRGBA(hex) : Jimp.intToRGBA(hex);
            
            if(rgba.r > 230 && rgba.g > 230 && rgba.b > 230) {
               image.setPixelColor(0x00000000, x, y); 
            }
          }
        }
        await image.write('frontend/public/images/logo-transparent.png');
        console.log('Background removed successfully!');
    } catch (e) {
        console.error(e);
    }
}
run();
