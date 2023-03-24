//Array of button colors that correspond to each ID in the index.html file.
let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];

//Tracks if/when the game has started or not.
//Only call nextSequence() on the first keypress.
let started = false;

//Variable level indicates the game starting at level 0.
let level = 0;

//Use jQuery to detect when a keyboard key has been pressed, when that happens for the first time, call nextSequence().
$(document).keypress(function() {
    if (!started) {
      //The h1 title starts out saying "Press A Key to Start", when the game has started, change this to say "Level 0".
      $("#level-title").text("Level " + level);
      nextSequence();
      started = true;
    }
  });

//jQuery code that detects when any of the colored buttons are clicked (triggers a handler function)
$(".btn").click(function() {
    let userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);

    playSound(userChosenColor);
    animatePress(userChosenColor);

    //Call checkAnswer() after a user has clicked and chosen their answer, passing in the index of the last answer in the user's sequence.
    checkAnswer(userClickedPattern.length-1);
});

function checkAnswer(currentLevel) {
  //Checks if the most recent user answer is the same as the game pattern.
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {

    //If the user got the most recent answer correct, then check that they have finished their sequence with another if statement.
    if (userClickedPattern.length === gamePattern.length){

      //Call nextSequence() after a 1000 millisecond delay.
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }

  } else{
     //Play sound if the user got one of the answers wrong.
     playSound("wrong");

     //Apply the game-over class to the body of the website when the user gets one of the answers wrong and then remove it after 200 milliseconds.
     $("body").addClass("game-over");
     //Change the h1 title to say "Game Over, Press Any Key to Restart" if the user got the answer wrong.
     $("#level-title").text("Game Over, Press Any Key to Restart");

     setTimeout(function () {
       $("body").removeClass("game-over");
     }, 200);

     startOver();
  }

}

/*
Function that creates a random number between 0 and 3, uses the random number to select a random color from the buttonColours array, 
adds the new randomChosenColour to the end of the empty gamePattern array, animates the associated ID using jQuery, and plays the appropiate sound 
from my list of sound files.
*/
function nextSequence(){
    userClickedPattern = [];
    //Increase the level by 1 every time nextSequence() is called.
    level++;

    //Update the <h1> tag with this change in the value of level.
    $("#level-title").text("Level " + level);

    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
}

//Function that takes a single input parameter (currentColor) and uses jQuery to add the pressed class styled in the styles.css file to the button that gets clicked inside animatePress(). 
//setTimeout() removes the style applied when a button is clicked after 100 milliseconds.
function animatePress(currentColor){
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
      }, 100);
}

//Function that takes a single input parameter (name) and plays the expected sound from the sounds directory.
function playSound(name){
  let audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}