const AbstractSprite = require('./abstractsprite');

function Decompress( bytes ) {
    const compressed = new Array(bytes.length * 2);
    for( let i = 0; i < bytes.length; i++ )
    {
        compressed[i * 2] = (bytes[i] & 0xF0) / 16;
        compressed[i * 2 + 1] = (bytes[i] & 0x0F);
    }

    const result = [];
    let j = 0;
    while( j < compressed.length ) {
        if( compressed[j] != 0 )
        {
            result.push( compressed[j] );
        }
        else if( (j + 1) < compressed.length )
        {
            const s = compressed[j + 1];
            let l = s;
            if( (s == 7) && ((j + 3) < compressed.length) )
            {
                l = compressed[j + 2] + (compressed[j + 3] << 4);
                j += 2;
            }
            else if( (s == 8) && ((j + 4) < compressed.length) )
            {
                l = compressed[j + 2] + (compressed[j + 3] << 4) + (compressed[j + 4] << 8);
                j += 3;
            }
            else if( (s == 0) && ((j + 2) < compressed.length) )
            {
                l = compressed[j + 2];
                j++;
            }
            else
            {
                l = s;
            }

            j++;

            for ( ;l > 0; --l) {
                result.push(0);
            }
        }

        j++;
    }

    j = 0;
    while( (j + 1) < result.length )
    {
        const k = result[j];
        result[j] = result[j + 1];
        result[j + 1] = k;
        j += 2;
    }

    return result;
}

function BuildPixels(bytes) {
    let result = []
    for( const b of bytes.slice( 0, 36864 ))
    {
        result.push( b & 0x0F );
        result.push( (b & 0xF0) / 16 );
    }
    result = result.concat( Decompress( bytes.slice( 36864 ) ) );
    while(result.length < 488 * 256) {
        result.push(0);
    }
    return result;
}

const topHeight = 256;
const portraintHeight = 32;
const compressedHeight = 200;


class AbstractCompressedSprite extends AbstractSprite{
    constructor(bytes) {
        super(bytes);
        this.pixels = BuildPixels( bytes.slice( 16 * 32 ) );
    }

    getPixel(index) {
        const y = Math.floor(index / this.width);
        const x = index % this.width;
        if (y < topHeight) {
            index = y *  this.width + x;
        } else if (y < topHeight + compressedHeight) {
            index = (y + portraintHeight) *  this.width + x;
        } else if (y < topHeight + portraintHeight + compressedHeight) {
            index = (y - compressedHeight) *  this.width + x;
        } else {
            index = y *  this.width + x;
        }

        return this.palettes[0].Colors[this.pixels[index] % 16]
        

    }

    getPixelXY(x, y) {
        return this.getPixel(x + y * this.width);
    }
}

module.exports = AbstractCompressedSprite;