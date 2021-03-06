// Snake = {
//     size: 4,
//     draw: function () {
//         console.log (this.size);
//     },
//    col: "#BBBBBB"
// }

const snake_final_col = 0x10ccff;
const snake_initial_col = 0x1000ff;
var snake_col_val= snake_initial_col;   //def col: 0x106410;
// change col value : 0xA00

function Snake (col) {
    this.col = col; //colour
    this.x = 1;
    this.y = 1;
    this.next = null;
}

Snake.prototype.add_block = function () {
    if (this.next == null) {
      this.next = new Snake (get_col_from_value(snake_col_val), null);
      this.update_trail ();

      //update snake colour
      // snake_col_val += 0x800;
			snake_col_val = lerp_colour (snake_col_val, snake_final_col, 0.08);
      // if (snake_col_val > 0x10EF10) {
      //   snake_col_val = 0x10EF10;
      // }

    } else {
      this.next.add_block ();
    }
}

Snake.prototype.update_trail = function () {
  //Will work only for 2 blocks or more.. one Block will throw an error
      if (this.next.next != null) {
          this.next.update_trail ();
      }
      this.next.x = this.x;
      this.next.y = this.y;
}

Snake.prototype.draw_trail = function () {
    //keep drawing till last block
    if (this.next != null) {
      this.next.draw_trail ();
    }
    DrawRect (this.x, this.y, snake_draw_size, snake_draw_size, this.col, "f");

}

Snake.prototype.delete_trail = function () {
    if (this.next != null) {
      this.next.delete_trail ();
    }
    this.next = null;
}

Snake.prototype.check_collision = function (x, y) {
    //(x,y) are coordinates of check collision point
    if (this.x == x && this.y == y) {
      return 1;
    }
    if (this.next != null) {
      return (this.next.check_collision (x, y));
    } else {
      return 0;
    }
}

function reset_snake (head) {

    snake_col_val = snake_initial_col;

    // var head = new Snake (get_col_from_value(snake_col_val));
    head.x = width/2;
    head.y = height/2;
    head.x = Math.floor (head.x/snake_size) * snake_size;
    head.y = Math.floor (head.y/snake_size) * snake_size;

    head.add_block ();
    // return head;
}

function move_snake_head_and_return_out_of_screen (dir, head) {

        //its time to move the snake
        switch (dir) {
            case 1:
            //up
              head.y -= snake_size;
              if (head.y < 0) {
                  // < 0 as x and y pos are coordinates of top left corner
                  //so at (0,0) player is still alive
                  //hence here player died
                  head.y = 0;
                  return 1;
              }
              break;

            case 3:
            //down
              head.y += snake_size;
              if (head.y >= height) {
                  // >= as (x,y) are coordinates of top left corner, so
                  // at (width, height) the top left of player is at the righmost point
                  //so player is out of the screen. hence died
                  head.y -= snake_size;
                  return 1;
              }

              break;

            case 2:
            //right
              head.x += snake_size;
                if (head.x >= width) {
                  //see the reason for >= in case 3
                  head.x -= snake_size;
                  return 1;
              }
              break;

            case 4:
            //left
              head.x -= snake_size;
              if (head.x < 0) {
                  //see the reason for < in case 1
                  head.x = 0;
                  return 1;
              }
              break;
        }
  return 0;
}
