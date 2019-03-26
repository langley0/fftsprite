const fs = require('fs');
const PNG = require('pngjs').PNG;
const TYPE1Sprite = require('./type1sprite');

const bytes = fs.readFileSync('TEST.SPR');
const spr = new TYPE1Sprite(bytes);

fs.createReadStream('test.png')
    .pipe(new PNG())
    .on('parsed', function() {

        console.log(this.data.length, spr.pixels.length);
 
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                //var idx = (this.width * y + x) << 2;
                const idx = (this.width * y + x);

                const color = spr.getPixel(idx);

                // invert color
                this.data[idx * 4] = color[0];
                this.data[idx * 4 + 1] = color[1];
                this.data[idx * 4 + 2] = color[2];
                this.data[idx * 4 + 3] = color[3];

                //console.log(this.data[idx*4], this.data[idx*4 + 1], color);
            }
        }
 
        this.pack().pipe(fs.createWriteStream('out.png'));
    });

