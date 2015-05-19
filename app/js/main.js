"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function setCanvasSize(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function traceLine(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
}

function drawLine(colour) {
    ctx.strokeStyle = colour;
    ctx.stroke();
}

function traceGrid(width, height) {
    for (var x = 0; x < width; x += (width/64)){
        traceLine(x, 0, x, width);
    }

    for (var y = 0; y < height; y += (height/64)) {
        traceLine(0, y, width, y);
    }
}

function canvasClickHandler(callback) {
    canvas.addEventListener("click", callback);
}

function getRelativeMousePosition(e) {
    var x, y;

    if (e.pageX !== undefined && e.pageY !== undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    return [x, y];
}

function getClickedCell(coords) {
    var x = Math.floor(coords[0]/8);
    var y = Math.floor(coords[1]/8);

    return [x, y];
}

function getCellFromMousePosition(e) {
    console.log(getClickedCell(getRelativeMousePosition(e)));
}


(function() {
    var w = 512;
    var h = 512;

    setCanvasSize(w, h);
    traceGrid(w, h);
    drawLine("#eee");
    canvasClickHandler(getCellFromMousePosition);
}());

