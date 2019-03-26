const AbstractCompressedSprite = require('./abstractcompressedsprite');

class AbstractShapedSprite extends AbstractCompressedSprite{
    constructor(bytes) {
        super(bytes);
    }
}

module.exports = AbstractShapedSprite;