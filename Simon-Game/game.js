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

//Function that takes a single input parameter (name) and plays the expected sound from the sounds directory.
function playSound(name){
    let audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
  }