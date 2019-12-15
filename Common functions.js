function DrawRect (x, y, l, b, col, mode) {
    ctx.beginPath ();
    ctx.rect (x, y, l, b);
    ctx.closePath ();
    if (mode == "s") {
        //stroke
        ctx.strokeStyle = col;
        ctx.stroke ();
    } else if (mode == "f") {
        ctx.fillStyle = col;
        ctx.fill ();
    } else
        return;
}

function get_col_from_value (val) {
    //returns string of colour from a hexadecimal number
    return ("#" + val.toString(16));
}

function DrawCircle (x, y, r, col) {
    ctx.beginPath ();
    ctx.fillStyle = col;
    ctx.arc (x, y, r, 0, 2*Math.PI, true);
    ctx.closePath ();
    ctx.fill ();
}
