/*variables*/

// three options in the selection screen
var userSelections = [false, false, false]; 
var renderFlag = false;
// different avatar images
var avatarImages = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
    ];
// avatar index that was selected
var avatarIndex; 
// enemey speed and collision proximity
var speedIncrease = 200;
var collisionProx = 20;
// number of hearts/lives 
var lives;
// diffetent colors of gems for each level of difficulty
var gemImages = [
    'images/Gem-Green.png',
    'images/Gem-Blue.png',
    'images/Gem-Orange.png'
    ];
// gem index based on color 
var gemIndex;
// position of gems
var gems= [0, 100, 200, 300, 400];
// points of each gem based on the difficulty level chosen
var pointsPerGem;
// total points scored in the game
var totalPoints = 0;
// total minutes of the game based on the time chosen in the selection screen
var minutes;
var allY = [60, 143, 226];

/*Enemy class*/
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = allY[Math.floor(Math.random() * 3)];
    this.speed = Math.floor(100 + (Math.random() * speedIncrease));
};

// adding update function to the prototype
Enemy.prototype.update = function(dt) {
    // time delta is added for smooth animation 
    this.x = this.x + (this.speed * dt);
    if (this.x > 550) {
        this.x = -100;
        this.y = this.y + 83;
        this.speed = Math.floor(100 + (Math.random() * speedIncrease));
        if (this.y > 226) {
            this.y = 60;
        }
    }
    if (player.y >= this.y - collisionProx && player.y <= this.y + collisionProx) {
        if (player.x >= this.x - collisionProx && player.x <= this.x + collisionProx) {
        player.reset();
        }
    }
};


Enemy.prototype.render = function() {
    //drawImage() method draws the enemy onto the canva at the x and y coordinate
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*Player class*/
var Player = function() {
  this.x = 200;
  this.y = 400;
};

// adding update function to the prototype
Player.prototype.update = function() {
    /* Move the player avatar based on the keyboards clicks of the user.
    Since the x coordinates increase on going left and y coordinates 
     of the canvas increase on going down on the canvas, changes are made
    to the game canvas accordingly based on the user keyboards clicks
    */
    if (this.ctlKey === 'left' && this.x > 0){ 
        this.x = this.x - 100;
    } else if (this.ctlKey === 'right' && this.x != 400){
        this.x = this.x + 100;
    } else if (this.ctlKey === 'up'){
        this.y = this.y - 83;
    } else if (this.ctlKey === 'down' && this.y != 400){
        this.y = this.y + 83;
    }
    this.ctlKey = null;
    if (this.y < 60){
        this.reset();
    }
};

Player.prototype.render = function() {
//drawImage() method draws the avatar onto the canva at the x and y coordinate
 ctx.drawImage(Resources.get(avatarImages[avatarIndex]), this.x, this.y);
};
// Assigning the input of the user to the variable
Player.prototype.handleInput = function(key) {
  this.ctlKey = key;
};
// Reset the location of the player and decrease number of lives when there is a collision
Player.prototype.reset = function() {
  player.x = 200;
  player.y = 400;
  lives--;
  document.getElementById('lives').innerHTML = 'Hearts: ' + lives;
  if (lives < 0) {
    endGame();
  }
};

/*Gem class*/
var Gem = function() {
  this.x = gems[Math.floor(Math.random() * 5)];
  this.y = allY[Math.floor(Math.random() * 3)];
};

// adding update function to the prototype
Gem.prototype.update = function() {
    if (player.y === this.y + 8 && player.y === this.y + 8) {
        if (player.x === this.x && player.x === this.x) {
        totalPoints = totalPoints + pointsPerGem;
        this.x = gems[Math.floor(Math.random() * 5)];
        this.y = allY[Math.floor(Math.random() * 3)];
        }
    }
    document.getElementById('points').innerHTML = 'Points: ' + totalPoints;
};

Gem.prototype.render = function() {
    // drawImage() method draws the gem onto the canva at the x and y coordinate
  ctx.drawImage(Resources.get(gemImages[gemIndex]), this.x, this.y);

};

/*instantiate objects*/
var enemyA = new Enemy();
var enemyB = new Enemy();
var enemyC = new Enemy();
var enemyD = new Enemy();
var allEnemies = [enemyA, enemyB, enemyC, enemyD];

var player = new Player();

var gem = new Gem();

/*click listener*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/*helper functions*/

//avatarClick method assigns the avatar image index based on user selection
function avatarClick (imgId, imgIndex) {
    avatarIndex = imgIndex;
    var buttons = document.getElementsByClassName('avatarImage'); 
    for (var i = 0, length = buttons.length; i < length; i++) {
       buttons[i].style.border = '3px solid black';
    }
    document.getElementById(imgId).style.border = '3px solid red';
    userSelections[0] = true;
}

// difficultyClick method assigns values to various variables based on the difficulty level chosen by the user
function difficultyClick (buttonID, rating) {
    switch (rating) {
    case 'Easy':
        speedIncrease = 200;
        collisionProx = 20;
        lives = 3;
        gemIndex = 0;
        pointsPerGem = 10;
        break;
    case 'Medium':
        speedIncrease = 400;
        collisionProx = 40;
        lives = 5;
        gemIndex = 1;
        pointsPerGem = 20;
        break;
    case 'Hard':
        speedIncrease = 600;
        collisionProx = 60;
        lives = 7;
        gemIndex = 2;
        pointsPerGem = 40;
    }
    var buttons = document.getElementsByClassName('difficultyButton'); 
    for(var i = 0, length = buttons.length; i < length; i++) {
       buttons[i].style.border = '1px solid #333333';
    }
    document.getElementById(buttonID).style.border = '3px solid red';
    document.getElementById('lives').innerHTML = 'Hearts: ' + lives;
    document.getElementById('dificultyText').innerHTML = 'Difficulty: ' + rating;
    userSelections[1] = true;
}

// timeClick methods assigns the time chosen by the user to the minutes variable
function timeClick (buttonID, duration) {
    switch (duration) {
    case 'one':
        minutes = 1;
        break;
    case 'two':
        minutes = 2;
        break;
    case 'three':
        minutes = 3;
    }
    var buttons = document.getElementsByClassName('durationButton'); 
    for (var i = 0, length = buttons.length; i < length; i++) {
       buttons[i].style.border = '1px solid #333333';
    }
    document.getElementById(buttonID).style.border = '3px solid red';
    userSelections[2] = true;
}

// startClick method is called when the user selects play on the selection screen
function startClick () {
    var selectionCount = 0;
    for (var i = 0, length = userSelections.length; i < length; i++) {
        if(userSelections[i] === true) {
           selectionCount++; 
        }
    }
    if (selectionCount === 3) {
        document.getElementById('selectionScreen').style.display = 'none';
        renderFlag = true;
        countdown(minutes);
    } else {
        alert('Please make all selections before starting the game.');
    }
}

// countdown method is a timer based on the minutes chosen by the user. When time becomes 0, endGame method is called
function countdown(minutes) {
    var seconds = 60;
    var mins = minutes;
    function tick() {
        var counter = document.getElementById("timer");
        var current_minutes = mins-1;
        seconds--;
        counter.innerHTML = 
        current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
        if ( seconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
            if (mins > 1){    
               setTimeout(function () { countdown(mins - 1); }, 1000);  
            }
        }
        if (current_minutes === 0 && seconds === 0) {
            endGame();
        }
    }
    tick();
}

// endGame method gives the summary of the game when the game completes
function endGame () {
    renderFlag = false;
    document.getElementById('pointsSummary').innerHTML = totalPoints;
    document.getElementById('gameScreen').style.display = 'block';
}
