// 1:up
// 3:down
// 2: right
// 4: left
var dir = 0; //direction the snake is moving
var main_snake = null;
var food_x = 0;
var food_y = 0;
const fps = 10;
var player_died = 0;

var animate_game_over_flag = 0;
var animate_next_fade_time = 0;
const animate_time_between_fades = 10;
var animate_colour_value = 0xABFFAB;



//total num of boxes in the x axis

window.onload = function () {
    canvas = document.getElementById ("myCanvas");
    ctx = canvas.getContext ("2d");
    width = canvas.width;
    height = canvas.height;

    Initialise_Game ();

    document.addEventListener ("keydown", function (evt) {
        // console.log(evt.keyCode);
        if (player_died == 1) {
            switch (evt.keyCode) {
              case 32:
                  Initialise_Game ();
                  break;
            }
        } else {
            //Playerr is alivee
            switch (evt.keyCode) {
              case 68:
              case 39:
              //right
                //if it is 1 then its going either up or down
                if (dir % 2 == 1) {
                    dir = 2;
                }
                break;

              case 65:
              case 37:
              //left
                //if it is 1 then its going either up or down
                if (dir % 2 == 1) {
                    dir = 4;
                }
                break;

              case 87:
              case 38:
                //up
                //if it is 0 then its going either left or right
                if (dir % 2 == 0) {
                    dir = 1;
                }
                break;

              case 40:
              case 83:
              //down
              //if it is 0 then its going either left or right
                if (dir % 2 == 0) {
                    dir = 3;
                }
                break;
            }
        }

        //space: 32
        // if (evt.keyCode == 32) {
        // // for debugging purposes
        //     main_snake.add_block ();
        // }
        // console.log(evt.keyCode);
    });
}

function Initialise_Game () {
  player_died = 0;
  animate_game_over_flag = 0;
  animate_next_fade_time = 0;
  animate_next_spawn_time = 0;
  animate_colour_value = 0xABFFAB;
  reset_food ();

  if (main_snake != null) {
    //player pressed play again
    main_snake.delete_trail ();
    main_snake.x = width/2;
    main_snake.y = height/2;
    main_snake.x = Math.floor (main_snake.x/snake_size) * snake_size;
    main_snake.y = Math.floor (main_snake.y/snake_size) * snake_size;
    dir = 0;
    snake_col_val = 0x106410;
  } else {
    main_snake = reset_snake ();
    setInterval (function () {
        FixedUpdate();
    }, 1000/fps);
  }

}

function End_Game () {
    dir = 0;
    player_died = 1;
    animate_game_over_flag = 1;
    //Animate_Game_Over_screen
}

function Animate_Screen () {
    var curr_time = (new Date ()).getTime ();
    if (animate_next_fade_time < curr_time) {
      animate_next_fade_time = curr_time + animate_time_between_fades;
      if (animate_colour_value > 3047982) {
        animate_colour_value -= 3*0x040404;
        // console.log(animate_colour_value);
      }
    }
    DrawRect (0,0, width, height, get_col_from_value(animate_colour_value), "f");
}


function FixedUpdate () {
    ctx.clearRect (0, 0, width, height);

    if (dir == 0 && player_died == 0) {
        //player is about to start the game
        ctx.font = "20px Arial";
        ctx.fillStyle = "#00AFFF";
        ctx.fillText("Press up/down/w/s key to begin", 250, 50);
        ctx.fillStyle = "#FFAF00";
        ctx.fillText("Press Space to reset game after dying", 250, 100);
    }

    //Animate game over check
    if (animate_game_over_flag == 1) {
      ctx.closePath ();
      Animate_Screen ();
    }

    //draw food
    DrawRect (food_x, food_y, snake_size*snake_draw_percent, snake_size*snake_draw_percent, "#FF6060", "f");

    if (main_snake.next != null) {
      main_snake.update_trail ();
    }

    if (dir != 0) {
      if (move_snake_head_and_return_dead (dir, main_snake)) {
          End_Game ();
      } else if (main_snake.next != null && main_snake.next.check_collision(main_snake.x, main_snake.y)) {
          console.log("collision");
          End_Game ();
      } else {
          //player hasnt died and is still playing
          //check if player got food
          if (main_snake.x == food_x && main_snake.y == food_y) {
            //player ate food... grow and reset food
            main_snake.add_block ();
            reset_food ();
          }
      }

    }

    main_snake.draw_trail ();
}

function reset_food () {
    food_x = Math.floor (width*Math.random());
    food_y = Math.floor (height*Math.random());

    food_x = Math.floor (food_x/snake_size) * snake_size;
    food_y = Math.floor (food_y/snake_size) * snake_size;
}
