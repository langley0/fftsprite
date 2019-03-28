const Palette = require('./palette');

function BuildPalettes( paletteBytes )
{
    const result = new Array(16);
    for( let i = 0; i < 16; i++ )
    {
        result[i] = new Palette( paletteBytes.slice( i * 32, (i + 1) * 32 ) );
    }

    return result;
}


class AbstractSprite {
    constructor( bytes ) {
        this.width = 256;
        this.originalSize = bytes.length;
        this.palettes = BuildPalettes( bytes.slice( 0, 16 * 32 ) );
    }
}


module.exports = AbstractSprite;