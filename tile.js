class Size {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const sizes = [
    new Size(  8,  8 ),
    new Size( 16,  8 ),
    new Size( 16, 16 ),
    new Size( 16, 24 ),
    new Size( 24,  8 ),
    new Size( 24, 16 ),
    new Size( 24, 24 ),
    new Size( 32,  8 ),
    new Size( 32, 16 ),
    new Size( 32, 24 ),
    new Size( 32, 32 ),
    new Size( 32, 40 ),
    new Size( 48, 16 ),
    new Size( 40, 32 ),
    new Size( 48, 48 ),
    new Size( 56, 56 )
];

function unsignedByteToSigned(byte) {
    if ((byte & 0x80) > 0) {
        // 음수이다.
        return byte - 256;
    } else {
        return byte;
    }
}

const type1Offset = {
    x: 16,
    y: 36
}

class Tile {
    constructor(bytes, yOffset, rotation) {
        rotation = (rotation * 1.40625);
        const x = unsignedByteToSigned(bytes[0]);
        const y = unsignedByteToSigned(bytes[1]);

        const flags = (bytes[2] + bytes[3] * 256);
        const reverseX = (flags & 0x4000) == 0x4000;
        const reverseY = (flags & 0x8000) == 0x8000;
        const f = ((flags >> 10) & 0x0F);
        const tileX = (flags & 0x1F) * 8;
        const tileY = ((flags >> 5) & 0x1F) * 8 + yOffset;

        const location = { x: x + type1Offset.x, y: y + type1Offset.y };
        const size = sizes[f];
        const rectangle = { x: tileX, y: tileY, width: size.x, height: size.y };

        this.rectangle = rectangle;
        this.reverseX = reverseX;
        this.reverseY = reverseY;
        this.location = location;
    }
}

module.exports = Tile;