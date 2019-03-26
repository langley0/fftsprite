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
    for( const b in bytes.slice( 0, 36864 ))
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

class AbstractCompressedSprite extends AbstractSprite{
    constructor(bytes) {
        super(bytes);

        this.topHeight = 256;
        this.portraintHeight = 32;
        this.compressedHeight = 200;

        this.pixels = BuildPixels( bytes.slice( 16 * 32 ) );
    }

    getPixel(index) {
        return this.palettes[0].Colors[this.pixels[index] % 16]

    }
}

module.exports = AbstractCompressedSprite;