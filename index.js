const fs = require('fs');
const PNG = require('pngjs').PNG;
const TYPE1Sprite = require('./type1sprite');
const sequences = require('./sequence');

const bytes = fs.readFileSync('TEST.SPR');
const spr = new TYPE1Sprite(bytes);

let i = 0;

if (!fs.existsSync('output')){
    fs.mkdirSync('output');
}


for(const seq of sequences) {
    const anims = seq.buildAnimation(spr);


    const dir = 'output/anim' + i;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    for (let i = 0; i < anims.bitmaps.length; ++i) {
        const f = anims.bitmaps[i];
        const png = new PNG({
            width : 185,
            height: 250,
            filterType: -1,
        });

        png.data = f.pixels;
        const buffer = PNG.sync.write(png);
        fs.writeFileSync(dir + '/' + i + '.png', buffer);
        png.data = null;
    }

    fs.writeFileSync(dir + '/delay.json', JSON.stringify(anims.delays));
    delete anims.bitmaps;
    
    ++i;
}