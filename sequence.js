const fs = require('fs');

function intFromBytes( x ){
    var val = 0;
    for (var i = x.length - 1; i >= 0; --i) {
        val += x[i];        
        if (i > 0) {
            val = val * 256;
        }
    }
    return val;
}

function init () {
    const bytes = fs.readFileSync('TYPE1.SEQ');
    const result= buildAll(bytes, new Array(218), false);
    return result;
}

function buildAll(bytes, names, mon) {
    const offsets = [];
    for (let i = 0; i < 0x100; i++) {
        if (mon && offsets.length >= 194) {
            break;
        }
        const currentOffset = intFromBytes(bytes.slice(i*4 + 4, (i+1)*4 + 4));
        if ( currentOffset == 0xFFFFFFFF ) {
            break;
        } else {
            offsets.push( currentOffset );
        }
    }

    const animationStart = 0x0406;
    const result = [];
    for ( let i = 0; i < offsets.length - 1; i++ )
    {
        if ( offsets[i] == offsets[i + 1] ) { continue; }
        //console.log(bytes.length, offsets[i], offsets[i+1]);
        const seq = buildOne( bytes.slice( animationStart + offsets[i], animationStart + offsets[i + 1]), i, names[result.length] );
        if ( seq ) {
            result.push( seq );
        }
    }

    const seq2 = buildOne( bytes.slice( animationStart + offsets[offsets.length - 1] ), offsets.length , names[result.length] );
    if ( seq2 ) {
        result.push( seq2 );
    }

    return result;
}

function buildOne(bytes, index, name) {
    const frames = ProcessSequence( bytes, index );
    if (frames) {
        const seq = new Sequence( frames, name );
        return seq;
    } else {
        return null;
    }
}

const jumps = {
    192: 1, 198: 1, 211: 1, 212: 1, 214: 1,
    215: 1, 216: 1, 226: 1, 238: 1, 239: 1,
    240: 1, 246: 1, 193: 2, 217: 2, 242: 2,
    252: 2, 250: 3
}

function ProcessSequence(bytes) {
    let i = 0;
    const sequence = [];
    while ( i < bytes.length - 1 )
    {
        if ( bytes[i] != 0xFF )
        {
            sequence.push( [bytes[i], bytes[i + 1]]);
        }
        else if ( bytes[i + 1] in jumps)
        {
            i += jumps[bytes[i + 1]];
        }

        i += 2;
    }
    if ( sequence.length == 0 ) {
        return null;
    }

    const result = [];
    for(const frame of sequence )
    {
        result.push( new AnimationFrame( frame[1], frame[0] ) );
    }

    return result;
}

class AnimationFrame {
    get Delay() {
        return this.delay;
    }
    
    get Index() {
        return this.index;
    }
    
    constructor(delay, index)
    {
        this.delay = delay;
        this.index = index;
    }
}

class Sequence {
    constructor(frames, name) {
        this.name = name;
        this.frames = frames;
        this.uniqueFrames = {};
        for (const frame of frames )
        {
            if (!(frame.Index in this.uniqueFrames)) {
                this.uniqueFrames[frame.Index] = true;
            }
        }
    }

    buildAnimation(sprite) {
        const frameToBitmap = {};
        const frames = sprite.Shape.getFrames(sprite);

        const result = [];
        const ourDelays = [];

        for (const frame of this.frames )
        {
            result.push( frames[frame.Index] );
            ourDelays.push( frame.Delay );
        }

        return { 
            bitmaps: result,
            delays: ourDelays
        }
    }
}

module.exports = init();