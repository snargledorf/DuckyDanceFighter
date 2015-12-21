/// <reference path="jquery-2.0.3.js" />
/// <reference path="http://code.createjs.com/easeljs-0.6.1.min.js" />

var FPS = 60;

var move_speed = 10;
var bullet_speed = move_speed;
var barney_speed = 7;

var initial_barney_spawn_frame = FPS;
var starting_barney_spawn_rate = 60; // In frames, reduce to make faster
var barney_spawn_increase_rate = 1;
var barney_kills_per_level_up = 20; // TODO Increase level up kill count with difficullty

var bullet_spawn_rate = 20; // In frames, reduce to make faster

var ducky_height = 100;
var ducky_width = ducky_height;
var bullet_width = 25;
var bullet_height = bullet_width;

var canvas;
var stage;

var ducky;
var ducky_bullets = [];
var barneys = [];

var lastBarneySpawn = 50;
var lastBulletShotCount = 0;

var barneysKilled = 0;
var currentBarenySpawnRate = starting_barney_spawn_rate;

var isPaused = false;

var keys = {};
var pause_key_code = 80; // 'p' key
var shoot_key_code = 83; // 's' key
var left_key_code = 37; // Left key
var right_key_code = 39; // Right key

$('body').keydown(function (event) {
    keys[event.keyCode] = true;
}).keyup(function (event) {
    delete keys[event.keyCode];
});

$(document).ready(function (e) {
    init();
});

function init() {    
    createCanvas();
    createStage();

    keys = {};
    ducky_bullets.length = 0;
    barneys.length = 0;
    barneysKilled = 0;
    
    currentBarenySpawnRate = starting_barney_spawn_rate;
    lastBarneySpawn = initial_barney_spawn_frame;

    drawDucky();
    startGameLoop();
}

function createCanvas() {
    if (canvas == null) {
        canvas = document.getElementById('game_canvas');
    }
}

function createStage() {
    if (stage == null) {
        stage = new createjs.Stage(canvas);
    } else {
        stage.removeAllChildren();
    }
}

function drawDucky() {
    ducky = createDucky();

    // Center the ducky
    ducky.y = canvas.height - ducky_height;
    ducky.x = (canvas.width - ducky_width) / 2;

    stage.addChild(ducky);
}

function startGameLoop() {
    createjs.Ticker.removeAllListeners();
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.addListener(update);
}

function update() {    
    readKeys();
    
    if (isPaused) {
        return;
    }
        
    updateBullets();
    updateBarneys();    
    checkForCollisions();
    
    stage.update();
}

function readKeys() {
    // First check if the pause key was hit
    if (keys[pause_key_code]) {
        isPaused = !isPaused;
    }

    if (isPaused) {
        return;
    }

    if (keys[left_key_code]) {
        moveDuckyLeft();
    }
    if (keys[right_key_code]) {
        moveDuckyRight();
    }
    if (keys[shoot_key_code]) {
        shootDucky();
    }
}

function moveDuckyLeft() {
    var new_left = (ducky.x - move_speed) < 0 
        ? 0 
        : ducky.x - move_speed;
    ducky.x = new_left;
}

function moveDuckyRight() {
    var new_left = (ducky.x + ducky_width + move_speed) > canvas.width 
        ? canvas.width - ducky_width 
        : ducky.x + move_speed;
    ducky.x = new_left;
}

function shootDucky() {
    // Limit how fast the bullets fire
    if (!shouldFireDucky()){
        return;
    }

    var bullet = createBullet();

    stage.addChild(bullet);

    ducky_bullets.push(bullet);
}

function shouldFireDucky() {
    if (--lastBulletShotCount > 0) {
        return false;
    }
    lastBulletShotCount = bullet_spawn_rate;
    return true;
}

function createBullet() {
    var bullet = createDucky();
    
    bullet.scaleX = .25;
    bullet.scaleY = .25;
           
    // Start the bullet from the middle of the ducky
    var centerOfDucky = ducky.x + (ducky_width / 2);
    bullet.x = centerOfDucky - (bullet_width / 2);
    bullet.y = ducky.y;
    
    return bullet;
}

function createDucky() {
    var spriteSheetData = {
        animations: {
            dance: [0, 26, 'dance', 4]
        },
        images: ['Content/images/ducky_sprite_map.bmp'],
        frames: {
            regX: 0,
            height: ducky_height,
            width: ducky_width,
            count: 27
        }
    };

    var spriteSheet = new createjs.SpriteSheet(spriteSheetData);

    var ducky = new createjs.BitmapAnimation(spriteSheet);
    
    // Start the dancing animation
    ducky.gotoAndPlay('dance');
    
    return ducky;
}

function updateBullets() {
    ducky_bullets.forEach(function (e) {
        e.y -= bullet_speed;
        if (e.y < -bullet_height) {
            removeBullet(e);
        }
    });
}

function removeBullet(bullet) {
    removeFromArray(ducky_bullets, bullet);
    stage.removeChild(bullet);
}

function spawnBarney() {
    var barney = createBarney();

    // Get a random location for the barney to start at.
    var randomX = (canvas.width - barney.image.width) * Math.random();
    
    // Start the barney off screen
    barney.y = -barney.image.height;
    barney.x = randomX;

    stage.addChild(barney);

    barneys.push(barney);
}

function createBarney() {
    return new createjs.Bitmap('Content/images/barney.png');
}

function updateBarneys() {  
    if (shouldSpawnBarney()) {
        spawnBarney();
        lastBarneySpawn = currentBarenySpawnRate;
    }

    barneys.forEach(function (barney) {
        barney.y += barney_speed;
        if (barney.y > canvas.height) {
            gameOver();
            return;
        }
    });
}

function shouldSpawnBarney() {
    return --lastBarneySpawn <= 0;
}

function checkForCollisions() {
    // Adjust positions to make collision closer to the images
    // No science to these numbers, determined by "feel"    
    barneys.forEach(function (barney) {
        if (checkForCollision(
                ducky.x + 15,
                ducky.y, 
                ducky_width - 30, 
                ducky_height - 20,
                barney.x + 15, 
                barney.y + 20, 
                barney.image.width - 30, 
                barney.image.height - 40)) {
            gameOver();
            return false;
        }

        ducky_bullets.forEach(function (bullet) {
            if (checkForCollision(
                    bullet.x, 
                    bullet.y, 
                    bullet_width, 
                    bullet_height, 
                    barney.x + 15, 
                    barney.y + 20, 
                    barney.image.width - 30, 
                    barney.image.height - 40)) {
                removeBarney(barney);                
                removeBullet(bullet);
                addBarneyKill();
            }
        });
    });
}

function addBarneyKill() {    
    barneysKilled++;
    
    // Increase the spawn rate if enough barneys have been killed.
    if ((barneysKilled % barney_kills_per_level_up) == 0) {
        increaseBarneySpawnRate();
    }
}

function increaseBarneySpawnRate() {
    // Since the spawn rate is in frames, we need reduce the number
    // of frames in order to increase the rate at which the barneys appear.
    currentBarenySpawnRate -= barney_spawn_increase_rate;
}

function checkForCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check if the sprite's don't overlap on the x plane.
    if ((x1 + w1) < x2 || (x2 + w2) < x1) {
        return false;
    }
    
    // Check if the sprite's don't overlap on the y plane.
    if ((y1 + h1) < y2 || (y2 + h2) < y1) {
        return false;
    }
    
    // Sprites overlap on both planes.
    return true;
}

function removeBarney(barney) {
    removeFromArray(barneys, barney);
    stage.removeChild(barney);
}

function removeFromArray(array, item) {
    var index = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
}

function gameOver() {
    alert("GAME OVER!");
    init();
}