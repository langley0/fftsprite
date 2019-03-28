const AbstractCompressedSprite = require('./abstractcompressedsprite');

class AbstractShapedSprite extends AbstractCompressedSprite{
    constructor(bytes) {
        super(bytes);
    }

    getFrames() {
        return this.Shape.getFrames(this);
    }
}

module.exports = AbstractShapedSprite;