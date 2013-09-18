/// <reference path="jquery-2.0.3.js" />
/// <reference path="http://code.createjs.com/easeljs-0.6.1.min.js" />

var FPS = 60;
var canvas;
var stage;
var ducky;
var ducky_bullets = [];

var keys = {};

$('body').keydown(function (event) {
    keys[event.keyCode] = true;
}).keyup(function (event) {
    delete keys[event.keyCode];
});

$(document).ready(function (e) {
    init();
});

function init() {
    // Grab the canvas and create the stage
    canvas = document.getElementById('game_canvas');
    stage = new createjs.Stage(canvas);
    drawDucky();
    startGameLoop();
}

function drawDucky() {

    var spriteSheetData = {
        animations: {
            dance:  [0, 26, 'dance', 4]
        },
        images: ['Content/images/ducky_sprite_map.bmp'],
        frames: {
            regX: 0,
            height: 100,
            width: 100,
            count: 27
        }
    };

    var spriteSheet = new createjs.SpriteSheet(spriteSheetData);

    ducky = new createjs.BitmapAnimation(spriteSheet);

    ducky.y = canvas.height - spriteSheetData.frames.height;
    ducky.x = (canvas.width - 100) / 2;

    ducky.gotoAndPlay('dance');

    stage.addChild(ducky);
}

function startGameLoop() {
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.addListener(gameLoop);
}

function gameLoop(e) {    
    update();
    stage.update();
}

function update() {
    if (keys[37]) { // left
        moveDuckyLeft();
    }
    if (keys[39]) { // right
        moveDuckyRight();
    }
    if (keys[32]) { // space
        shootDucky();
    }

    updateBullets();
}

var move_speed = 10;
function moveDuckyLeft() {
    var new_left = (ducky.x - move_speed) < 0 ? 0 : ducky.x - move_speed;
    ducky.x = new_left;
}

function moveDuckyRight() {
    var new_left = (ducky.x + 100 + move_speed) > canvas.width ? canvas.width - 100 : ducky.x + move_speed;
    ducky.x = new_left;
}
var lastBulletShotCount = 0;
function shootDucky() {

    if (lastBulletShotCount > 0) {
        lastBulletShotCount--;
        return;
    }

    lastBulletShotCount = 10;

    var spriteSheetData = {
        animations: {
            dance: [0, 26, 'dance', 4]
        },
        images: ['Content/images/ducky_sprite_map.bmp'],
        frames: {
            regX: 0,
            height: 100,
            width: 100,
            count: 27
        }
    };

    var spriteSheet = new createjs.SpriteSheet(spriteSheetData);

    var bullet = new createjs.BitmapAnimation(spriteSheet);

    bullet.y = ducky.y;
    bullet.x = ducky.x + (75 / 2);
    bullet.scaleX = .25;
    bullet.scaleY = .25;

    bullet.gotoAndPlay('dance');

    stage.addChild(bullet);

    ducky_bullets.push(bullet);
}

function updateBullets() {
    ducky_bullets.forEach(function (e) {
        e.y -= 10;
        if (e.y < -25) {
            removeBullet(e);
        }
    });
}

function removeBullet(bullet) {
    var index = ducky_bullets.indexOf(bullet);
    if (index >= 0) {
        ducky_bullets.splice(index, 1);
    }

    stage.removeChild(bullet);
}