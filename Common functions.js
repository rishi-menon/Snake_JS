const snake_size = 20;
//this is to add spaces between blocks
const snake_draw_percent = 0.85; //this is to draw a portion of the block...
const snake_draw_size = snake_size * snake_draw_percent;

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

function lerp_colour (a, b, value) {
		// # RRGGBB - each letter is 4 bytes
		var red = lerp (a>>16, b>>16, value);
		var green = lerp ((a>>8) & 0xFF, (b>>8) & 0xFF, value);
		var blue = lerp (a & 0xFF, b & 0xFF, value);
		return (red<<16 | green<<8 | blue);
}
function lerp (a, b, value) {
		return a + (b-a) * value;
}
// 
// function DrawCircle (x, y, r, col) {
//     ctx.beginPath ();
//     ctx.fillStyle = col;
//     ctx.arc (x, y, r, 0, 2*Math.PI, true);
//     ctx.closePath ();
//     ctx.fill ();
// }
