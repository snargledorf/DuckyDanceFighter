/// <reference path="jquery-2.0.3.js" />
/// <reference path="http://code.createjs.com/easeljs-0.6.1.min.js" />

var FPS = 60;
var canvas;
var stage;
var ducky;
var ducky_bullets = [];
var barneys = [];

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
    if (canvas == null) {
        canvas = document.getElementById('game_canvas');
    }
    if (stage == null) {
        stage = new createjs.Stage(canvas);
    }
    else
    {
        stage.removeAllChildren();
    }

    keys = {};
    ducky_bullets.length = 0;
    barneys.length = 0;
    lastBarneySpawn = 50;

    drawDucky();
    startGameLoop();
}

function drawDucky() {

    ducky = createDucky();

    ducky.y = canvas.height - 100;
    ducky.x = (canvas.width - 100) / 2;

    ducky.gotoAndPlay('dance');

    stage.addChild(ducky);
}

function startGameLoop() {
    createjs.Ticker.removeAllListeners();
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.addListener(gameLoop);
}

function gameLoop(e) {    
    update();
    stage.update();
}

var lastBarneySpawn = 50;
function update() {
    if (keys[37]) { // left
        moveDuckyLeft();
    }
    if (keys[39]) { // right
        moveDuckyRight();
    }
    if (keys[83]) { // 's'
        shootDucky();
    }

    updateBullets();

    if (lastBarneySpawn-- <= 0) {
        spawnBarney();
        lastBarneySpawn = 20;
    }

    updateBarneys();
    
    checkForCollisions();
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

    var bullet = createDucky();   

    bullet.y = ducky.y;
    bullet.x = ducky.x + (75 / 2);
    bullet.scaleX = .25;
    bullet.scaleY = .25;

    bullet.gotoAndPlay('dance');

    stage.addChild(bullet);

    ducky_bullets.push(bullet);
}

function createDucky() {
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

    return new createjs.BitmapAnimation(spriteSheet);
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
    removeFromArray(ducky_bullets, bullet);
    stage.removeChild(bullet);
}

function spawnBarney() {
    var barney = new createjs.Bitmap('Content/images/barney.png');

    var randomX = (canvas.width - barney.image.width) * Math.random();

    barney.y = -barney.image.height;
    barney.x = randomX;

    stage.addChild(barney);

    barneys.push(barney);
}

function updateBarneys() {
    barneys.forEach(function (barney) {
        barney.y += 7;
        if (barney.y > canvas.height) {
            removeBarney(barney);
        }
    });
}

function checkForCollisions() {
    barneys.forEach(function (barney) {

        var ducky_pt = ducky.localToLocal(50, 0, barney);
        if (barney.hitTest(ducky_pt.x, ducky_pt.y)) {
            gameOver();
            return false;
        }

        ducky_bullets.forEach(function (bullet) {
            var pt = bullet.localToLocal(0, 0, barney);

            if (barney.hitTest(pt.x, pt.y)) {
                removeBarney(barney);
                removeBullet(bullet);
            }
        });
    });
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