/// <reference path="jquery-2.0.3.js" />

$('body').keydown(function (event) {

    var min = $('#game_area').offset().left;
    var max = min + $('#game_area').width();

    switch (event.keyCode) {
        case 37: // left
            moveObjectLeft($('#ducky'), min, max);
            break;       
        case 39: // right
            moveObjectRight($('#ducky'), min, max);
            break;       
    }
});

var move_amt = 10;

function moveObjectLeft(object, min, max) {
    var objectLeft = object.offset().left;

    var new_left = ((objectLeft - move_amt < min) ? min : objectLeft - move_amt);
    object.offset({ left: new_left });
}

function moveObjectRight(object, min, max) {
    var objectLeft = object.offset().left;

    // Adjust max to compensate for objects width
    max = max - object.width();

    var new_left = ((objectLeft + move_amt > max) ? max : objectLeft + move_amt);
    object.offset({ left: new_left });
}