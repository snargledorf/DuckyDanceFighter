/// <reference path="jquery-2.0.3.js" />

var FPS = 60;

var game_canvas_element = $('#game_canvas');
var game_canvas = game_canvas_element.get(0).getContext("2d");
var ducky = $('#ducky');

$(document).ready(function (e) {
    init();
});

function init() {
    centerDucky();
    startGameLoop();
}

var ducky = {
    color: "#F00",
    x: 0,
    height: 32,
    width: 32,
    draw: function () {
        game_canvas.fillStyle = this.color;
        game_canvas.fillRect(this.x, game_canvas_element.height() - this.height, this.width, this.height);
    }
};

function centerDucky() {
    var duckyNewLeft = (game_canvas_element.width() / 2) - (ducky.width / 2);
    ducky.x = duckyNewLeft;
}

function startGameLoop() {
    setInterval(function () {
        update();
        draw();
    }, 1000 / FPS);
}

var keys = {};

$('body').keydown(function (event) {
    keys[event.keyCode] = true;
}).keyup(function (event) {
    delete keys[event.keyCode];
});

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
}

function draw() {
    drawGameArea();
    ducky.draw();
}

function drawGameArea() {
    game_canvas.clearRect(0,0,game_canvas_element.width(), game_canvas_element.height());
    game_canvas.fillStyle = "#FFF";
    game_canvas.fillRect(0, 0, game_canvas_element.width(), game_canvas_element.height());
}

var move_speed = 5;
function moveDuckyLeft() {
    var new_x = ducky.x - move_speed < 0 ? 0 : ducky.x - move_speed;
    ducky.x = new_x;
}

function moveDuckyRight() {
    var new_x = (ducky.x + move_speed) > (game_canvas_element.width() - ducky.width) ? (game_canvas_element.width() - ducky.width) : (ducky.x + move_speed);
    ducky.x = new_x;
}

function shootDucky() {

}