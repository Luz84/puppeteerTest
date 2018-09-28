const pixelmatch = require('pixelmatch')
const fs = require('fs')
const PNG = require('pngjs').PNG



exports.compareScreenshots = fileName => {
    return new Promise((resolve, reject) => {
        const doneReading = () => {
            expect(img1.width).toBe(img2.width)
            expect(img2.height).toBe(img1.height)
            const numDiffPixels = pixelmatch(
                img1.data,
                img2.data,
                diff.data,
                img1.width,
                img1.height,
              
               
                { threshold: 0.1 }
            )
            diff.pipe(fs.createWriteStream('diff.png'));
            expect(numDiffPixels).toBe(0)
            resolve()

        }
       
  
        const img1 = fs.createReadStream('testScreenshot.png').pipe(new PNG())
        const img2 = fs.createReadStream(fileName).pipe(new PNG()).on('parsed', doneReading)
        const diff = new PNG({width: img1.width, height: img1.height});
       

    })

}