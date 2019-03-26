function BytesToColor(  first, second )
{
    const b = (second & 0x7C) << 1;
    const g = (second & 0x03) << 6 | (first & 0xE0) >> 2;
    const r = (first & 0x1F) << 3;
    //int a = (second & 0x80) >> 7;

    return [ r, g, b, 0xFF ];
}

class Palette  {
    constructor(bytes) {
        this.Build16BitPalette( bytes );
    }

    Build16BitPalette(  bytes  ) {
        const count = bytes.length / 2;
        this.Colors = new Array(count);
        for (let i = 0; i < count; i++)
        {
            this.Colors[i] = BytesToColor( bytes[i * 2], bytes[i * 2 + 1] );
        }
    }
}
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