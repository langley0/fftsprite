const Tile = require('./tile');

const defaultFrameSize = {
    w: 185,
    h: 250
};

const type1FrameSize = {
    w: 24,
    h: 48
}

function CopyRectangleToPoint( source,  sourceRectangle, destination, destinationPoint, reverseX, reverseY ) {

    const width = sourceRectangle.width;
    const height = sourceRectangle.height;
    const x = destinationPoint.x;
    const y = destinationPoint.y;
    
    const calcX = reverseX ? 
        (col) => (width - col - 1) :
        (col) => col;

    const calcY = reverseY ?
        (row) => (height - row - 1) :
        (row) => row;

    //console.log(x, y, width, height, reverseX, reverseY);

    for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
            const colors = source.getPixelXY( col + sourceRectangle.x, row + sourceRectangle.y );
            if (colors[3] > 0 ) {
                const index = (x + calcX(col) + (y + calcY(row)) * destination.width) * 4;;

                destination.pixels[index + 0] = colors[0];
                destination.pixels[index + 1] = colors[1];
                destination.pixels[index + 2] = colors[2];
                destination.pixels[index + 3] = colors[3];
            }
        }
    }
}

class Frame {
    constructor(bytes, yOffset, name) {
        let rotation = 0;
        let ydisplayoffset = 0;
        let numberOfTiles = bytes[0] + bytes[1] * 256;


        if (name == "WEP1" || name == "WEP2" ||name == "EFF1" || name == "EFF2" )
        {
            numberOfTiles = 0;
            rotation = bytes[0] + bytes[1] * 256;
            ydisplayoffset = bytes[0] / 4;
        }


        const tiles = [];
        for( let i = 0; i <= numberOfTiles; i++ ) {
            tiles.push( new Tile( bytes.slice( 2 + i * 4, 2 + i * 4 + 4 ), yOffset, rotation) );
        }

        const reversed = tiles.reverse();
        this.tiles = reversed;
    }

    getFrame(source) {
        const result = {
            width: type1FrameSize.w,
            height: type1FrameSize.h,
            pixels: new Array(defaultFrameSize.w * defaultFrameSize.h * 4)
        };

        for ( const t of this.tiles ) {
            CopyRectangleToPoint(source, t.rectangle, result, t.location, t.reverseX, t.reverseY );
        }

        return result;
    }
}

module.exports = Frame;