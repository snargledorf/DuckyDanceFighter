/// <reference path="jquery-2.0.3.js" />
$(document).ready(function (e) {
    gameLoop();
});


function moveDuckyLeft(min, max) {
    moveObjectLeft($('#ducky'));
}

function moveDuckyRight(min, max) {
    moveObjectRight($('#ducky'));
}

var move_amt = 10;

function moveObjectLeft(object) {
    var bounds = getGameAreaBounds();
    var min = bounds.left;

    var objectLeft = object.offset().left;

    var new_left = ((objectLeft - move_amt < min) ? min : objectLeft - move_amt);
    object.offset({ left: new_left });
}

function moveObjectRight(object) {
    var bounds = getGameAreaBounds();
    var max = bounds.right - object.width();

    var objectLeft = object.offset().left;

    var new_left = ((objectLeft + move_amt > max) ? max : objectLeft + move_amt);
    object.offset({ left: new_left });
}

function getGameAreaBounds() {
    var left = game_area.offset().left;
    var right = left+game_area.width();
    var top = game_area.offset().top;
    var bottom = top+game_area.height();

    return ({ left: left, right: right, top: top, bottom: bottom});
}

$('body').keydown(function (event) {
    keys[event.keyCode] = true;
}).keyup(function (event) {
    delete keys[event.keyCode];
});

var game_area = $('#game_area');
var keys = {};

function gameLoop() {
    
    if (keys[37]) { // left
        moveDuckyLeft();
    }

    if (keys[39]) { // right
        moveDuckyRight();
    }
    
    setTimeout(gameLoop, 20);
}