/// <reference path="jquery-2.0.3.js" />
/// 

var game_area = $('#game_area');
var ducky = $('#ducky');

$(document).ready(function (e) {
    init();
});

function init() {
    centerDucky();
    gameLoop();
}

function centerDucky() {
    var gameAreaBounds = getGameAreaBounds();
    var duckyNewLeft = ((game_area.width() / 2) - (ducky.width() / 2)) + gameAreaBounds.left;
    setObjectLeftOffset(ducky, duckyNewLeft);
}

function moveDuckyLeft(min, max) {
    moveObjectLeft(ducky);
}

function moveDuckyRight(min, max) {
    moveObjectRight(ducky);
}

var move_amt = 10;

function moveObjectLeft(object) {
    var bounds = getGameAreaBounds();
    var min = bounds.left;

    var objectLeft = object.offset().left;

    var newLeft = ((objectLeft - move_amt < min) ? min : objectLeft - move_amt);
    setObjectLeftOffset(object, newLeft);
}

function moveObjectRight(object) {
    var bounds = getGameAreaBounds();
    var max = bounds.right - object.width();

    var objectLeft = object.offset().left;

    var newLeft = ((objectLeft + move_amt > max) ? max : objectLeft + move_amt);
    setObjectLeftOffset(object, newLeft);
}

function setObjectLeftOffset(object, left) {
    object.offset({ left: left });
}

function getGameAreaBounds() {
    var left = game_area.offset().left;
    var right = left+game_area.width();
    var top = game_area.offset().top;
    var bottom = top+game_area.height();

    return ({ left: left, right: right, top: top, bottom: bottom});
}

var keys = {};

$('body').keydown(function (event) {
    keys[event.keyCode] = true;
}).keyup(function (event) {
    delete keys[event.keyCode];
});

function gameLoop() {
    
    if (keys[37]) { // left
        moveDuckyLeft();
    }

    if (keys[39]) { // right
        moveDuckyRight();
    }
    
    setTimeout(gameLoop, 20);
}