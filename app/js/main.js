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


function drawLine(color) {
    ctx.strokeStyle = color;
    ctx.stroke();
}

function traceGrid() {
    for (var x = 0.5; x < 64; x +=8){
        traceLine(x, 0, x, 512);
    }
    
    for (var y = 0.5; y < 64; x += 8){
        traceLine(0, y, 512, y);
    }
}



setCanvasSize(512, 512);
traceGrid();
drawLine("#eee");

