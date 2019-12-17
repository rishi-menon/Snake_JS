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
const animate_initial_colour = 0x91e2ff;
var animate_colour_value = animate_initial_colour;
var animate_percent = 0;

//Intervals variables
var fixed_update_interval = 0;

//direction list
const dirs_size = 2;
var dirs_list = []; //can store only next two directions

window.onload = function () {
    canvas = document.getElementById ("myCanvas");
    ctx = canvas.getContext ("2d");
    width = canvas.width;
    height = canvas.height;

    Initialise_Game ();

    document.addEventListener ("keydown", function (evt) {

        if (game_over_screen == 1) {
						//game is over
            switch (evt.keyCode) {
              case 32:
									//space key... restart game
                  Initialise_Game ();
                  break;
            }
        } else {
						//new dir should latest dir which should be the last element of a list
						//or the dir if the list is empty
						var new_dir = (dirs_list.length > 0) ? dirs_list[dirs_list.length - 1] : dir;
						var old_dir = new_dir;

            //Playerr is alivee
            switch (evt.keyCode) {
              case 68:
              case 39:
              //right
                //if it is 1 then its going either up or down
                if (new_dir % 2 == 1) {
                    new_dir = 2;
                }
                break;

              case 65:
              case 37:
              //left
                //if it is 1 then its going either up or down
                if (new_dir % 2 == 1) {
                    new_dir = 4;
                }
                break;

              case 87:
              case 38:
                //up
                //if it is 0 then its going either left or right
                if (new_dir % 2 == 0) {
                    new_dir = 1;
                }
                break;

              case 40:
              case 83:
              //down
              //if it is 0 then its going either left or right
                if (new_dir % 2 == 0) {
                    new_dir = 3;
                }
                break;
            }

						//check whether to add direction to the list or not
						//add if there is a new direction AND if size is left
						if (new_dir != old_dir && dirs_list.length < dirs_size) {
								//add direction to the list
								dirs_list.push (new_dir);
						}
        }

        // for debugging purposes
        // if (evt.keyCode == 32) {
				//
        //     main_snake.add_block ();
        // }
        // console.log(evt.keyCode);
    });
}

function Initialise_Game () {
  game_over_screen = 0;
	dir = 0;
  animate_colour_value = animate_initial_colour;
	animate_percent = 0;
	fps = starting_fps;
	player_score = 2;
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
		//start game over animation
    game_over_screen = 1;
}

function FixedUpdate () {
    //clear screen
    ctx.clearRect (0, 0, width, height);

		if (game_over_screen == 1) {
			//play death animation
			Animate_Death_Screen ();
			ctx.font = "20px Arial";
			ctx.fillStyle = "#a4ff96";
			ctx.fillText("Press space to play again", 250, 120);
		}

		//display starting message
    if (dir == 0 && game_over_screen == 0) {
        //player is about to start the game
        display_starting_text ();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // MAIN LOGIC OF GAME
		// - Change direction if necessary
    // - Update snakes trail
    // - Move head of the snake
    //    - Check if it eats food
    //    - Check if it dies
    // - Draw snake
		////////////////////////////////////////////////////////////////////////////////////////////////

		//change direction
		if (dirs_list.length > 0) {
			dir = dirs_list.shift ();
		}

    //update trail only if its longer than 1 block
    if (main_snake.next != null) {
      //if condition might be useless as snake starts with 3 blocks
      main_snake.update_trail ();
    }

    //check if player is alive or not
    //move head only if it is alive
    if (dir != 0) {
      //move head and check if the snake goes out of the screen
      if (move_snake_head_and_return_out_of_screen (dir, main_snake)) {
					//out of screen
          End_Game ();

      } else if (main_snake.next != null && main_snake.next.check_collision(main_snake.x, main_snake.y)) {
          //snake ate itself
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
							if (player_score >= 25) {
								//from now on, increment fps only by 1 every 5 levels
								fps -= 1;
							}
							fps += 2;

							change_fixed_update ();
						}
          }
      }
    }

    //draw trail of snake
    main_snake.draw_trail ();

		//Invisible wall test
		// DrawRect (0, height/2, width, 2*snake_size, get_col_from_value(animate_colour_value), "f");
		//test over

    //draw food
    DrawRect (food_x, food_y, snake_draw_size, snake_draw_size, "#FF6060", "f");


		//display score
		ctx.font = "35px Arial";
    ctx.fillStyle = "#666666";
    ctx.fillText(player_score.toString(), 400, 80);

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
    ctx.fillStyle = "#0049b0";
    ctx.fillText("Press up/down/w/s key to start", 280, 45);
}

function change_fixed_update () {
		if (fixed_update_interval != 0) {
				clearInterval (fixed_update_interval);
		}
		fixed_update_interval = setInterval (FixedUpdate, 1000/fps);
}
