const AbstractShapedSprite = require('./abstractshapedsprite');
const Shape = require('./shape');

class TYPE1Sprite  extends AbstractShapedSprite{
    constructor(bytes) {
        super(bytes);

        this.Shape = Shape.TYPE1;
    }
    
}

module.exports = TYPE1Sprite;