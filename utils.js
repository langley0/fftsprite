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


module.exports = {
    intFromBytes: intFromBytes
}