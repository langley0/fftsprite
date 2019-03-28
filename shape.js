const fs = require('fs');
const utils = require('./utils');
const Frame = require('./frame');

class Shape {
    constructor(bytes, name, rectangle) {
        this.name = name;
        const jump = utils.intFromBytes(bytes.slice(0, 4));
        const secondHalf = bytes[4] + bytes[5] * 256;
        
        if (name == "WEP1" || name == "WEP2" || name == "WEP3" || name == "EFF1" || name == "EFF2") {
            this.frames = this.buileWEP(bytes, name, jump, secondHalf);
        } else  {
            this.frames = this.buildNormal(bytes, name, jump, secondHalf);
        }
    }

    buileWEP(bytes, name, jump, secondHalf) {
        let offsets = [0];
        let addy = 0;
        let i = 0;
        do
        {
            addy = utils.intFromBytes(bytes.slice(0x48 + 4 * i, 0x48 + 4 * i + 4));
            i++;
            if (addy != 0)
            {
                offsets.push(addy);
            }
        } while (addy != 0);
        const frames = [];
        for (i = 0; i < offsets.length; i++)
        {
            frames.push(new Frame(bytes.slice((offsets[i] + 0x846)), 0, name));
        }

        return frames;
    }

    buildNormal(bytes, name, jump, secondHalf) {
        let offsets = [0];
        let addy = 0;
        let i = 0;
        do {
            addy = utils.intFromBytes(bytes.slice(0x0C + 4 * i, 0x0C + 4 * i + 4));
            i++;
            if (addy != 0)
            {
                offsets.push(addy);
            }
        } while (addy != 0);

        const frames = [];
        for (i = 0; i < offsets.length; i++) {
            frames.push(new Frame(bytes.slice((offsets[i] + 0x40A)), i >= secondHalf ? 256 : 0, name));
        }

        if (jump > 8) {
            offsets = [0];
            addy = 0;
            i = 0;
            do
            {
                addy = utils.intFromBytes(bytes.slice(jump + 4 * i + 4, jump + 4 * i + 4 + 4));
                i++;
                if (addy != 0)
                {
                    offsets.push(addy);
                }
            } while (addy != 0);
        }
        
        for (let i = 0; i < offsets.length; i++) {
            frames.push(new Frame(bytes.slice((offsets[i] + jump + 0x402)), i >= secondHalf ? 256 : 0,name));
        }

        return frames;1
    }

    getFrames( source ) {
        const result = [];
        for(const f of this.frames ) {
            result.push( f.getFrame( source ) );
        }
        return result;
    }
}

const type1_shp = fs.readFileSync('TYPE1.SHP');
const type1 = new Shape(type1_shp , "TYPE1", {x:106, y:85, w:48, h:56} );

module.exports = {
    TYPE1: type1
}