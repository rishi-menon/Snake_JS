// 1:up
// 3:down
// 2: right
// 4: left

var dir = 0; //direction the snake is moving
var main_snake = null;
var food_x = 0;
var food_y = 0;

const starting_fps = 10;
var fps = 10;
var game_over_screen = 0;
var player_score = 2;

//animation variables
const animate_completion_time = 0.6; //in seconds
const animate_final_colour = 0x444444;
const animate_initial_colour = 0xABFFAB;
var animate_colour_value = animate_initial_colour;
var animate_percent = 0;

//Intervals variables
var fixed_update_interval = 0;

window.onload = function () {
    canvas = document.getElementById ("myCanvas");
    ctx = canvas.getContext ("2d");
    width = canvas.width;
    height = canvas.height;

    Initialise_Game ();

    document.addEventListener ("keydown", function (evt) {
        // console.log(evt.keyCode);
        if (game_over_screen == 1) {
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
        if (evt.keyCode == 32) {
        // for debugging purposes
            // main_snake.add_block ();
        }
        // console.log(evt.keyCode);
    });
}

function Initialise_Game () {
  game_over_screen = 0;
	dir = 0;
  animate_colour_value = animate_initial_colour;
	animate_percent = 0;
	fps = starting_fps;
  reset_food ();

  if (main_snake != null) {
    //player pressed play again
    main_snake.delete_trail ();
  } else {
    main_snake = new Snake (get_col_from_value(snake_col_val));
  }

	reset_snake (main_snake);
	change_fixed_update ();
}

function End_Game () {
    dir = 0;
    game_over_screen = 1;
		//start game over animation
}

function change_fixed_update () {
		if (fixed_update_interval != 0) {
				clearInterval (fixed_update_interval);
		}
		fixed_update_interval = setInterval (FixedUpdate, 1000/fps);
}

function FixedUpdate () {
    //clear screen
    ctx.clearRect (0, 0, width, height);
    //display starting message
    if (dir == 0 && game_over_screen == 0) {
        //player is about to start the game
        display_starting_text ();
    }

		if (game_over_screen == 1) {
			//play death animation
			Animate_Death_Screen ();
		}

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // MAIN LOGIC OF GAME
    // - Update snakes trail
    // - Move head of the snake
    //    - Check if it eats food
    //    - Check if it dies
    // - Draw snake

    //update trail only if its longer than 1 block
    if (main_snake.next != null) {
      //if condition might be useless as snake starts with 3 blocks
      main_snake.update_trail ();
    }

    //check if player is alive or not
    //move head only if it is alive
    if (dir != 0) {
      //move head and check if the snake goes out of the screen
      if (move_snake_head_and_return_dead (dir, main_snake)) {
          End_Game ();

      } else if (main_snake.next != null && main_snake.next.check_collision(main_snake.x, main_snake.y)) {
          //snake ate itself
          console.log("collision");
          End_Game ();

      } else {
          //player hasnt died and is still playing
          //check if player got food
          if (main_snake.x == food_x && main_snake.y == food_y) {
            //player ate food... grow and reset food
            main_snake.add_block ();
						reset_food ();


						player_score += 1;
						//change speed of game if necessary
						if (player_score % 5 == 0) {
							fps += 2;
							change_fixed_update ();
						}
          }
      }
    }

    //draw trail of snake
    main_snake.draw_trail ();

    //draw food
    DrawRect (food_x, food_y, snake_draw_size, snake_draw_size, "#FF6060", "f");

}

function reset_food () {
    food_x = Math.floor (width*Math.random());
    food_y = Math.floor (height*Math.random());

    food_x = Math.floor (food_x/snake_size) * snake_size;
    food_y = Math.floor (food_y/snake_size) * snake_size;
}

function Animate_Death_Screen () {
		// increment by delta_time / animate_completion_time
		if (animate_percent < 1) {
			animate_percent += 1 / (animate_completion_time * fps);
	    animate_colour_value = lerp_colour (animate_initial_colour, animate_final_colour, animate_percent);
		}
		if (animate_percent > 1.0) {
			animate_percent = 1;
			animate_colour_value = animate_final_colour;
		}
    DrawRect (0,0, width, height, get_col_from_value(animate_colour_value), "f");
}

function display_starting_text () {

    //player is about to start the game
    ctx.font = "20px Arial";
    ctx.fillStyle = "#00AFFF";
    ctx.fillText("Press up/down/w/s key to begin", 250, 50);
    ctx.fillStyle = "#FFAF00";
    ctx.fillText("Press Space to reset game after dying", 250, 100);

}
