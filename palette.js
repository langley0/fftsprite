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

        const tranparent = this.Colors[0];
        if (tranparent[0] === 0 & tranparent[1] === 0 && tranparent[2] === 0) {
            tranparent[3] = 0;
        }
    }
}

module.exports = Palette;