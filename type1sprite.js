const AbstractShapedSprite = require('./abstractshapedsprite');

class TYPE1Sprite  extends AbstractShapedSprite{
    constructor(bytes) {
        super(bytes);
    }
}

module.exports = TYPE1Sprite;