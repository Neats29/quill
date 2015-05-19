"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Canvas rendering

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

function colorCells(cellGrid, width, height) {
    var cellWidth = width/64;
    var cellHeight = height/64;

    cellGrid.forEach(function(row, rownum) {
        row.forEach(function(cell, colnum) {
            ctx.fillStyle = cell;
            ctx.fillRect((colnum*8), (rownum*8), cellWidth, cellHeight);
        });
    });
}

function drawCanvas(cellGrid, width, height) {
    colorCells(cellGrid, width, height);
    traceGrid(width, height);
    drawLine("#eee");
}

// Getting click location

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

// event listener and click handler

function addClickHandler(element, callback) {
    element.addEventListener("click", callback);
}

function render(state) {
    setCanvasSize(state.width, state.height);
    drawCanvas(state.canvas, state.width, state.height);
}


(function() {

    function canvasMaker() {
        var canvas = [];

        for (var i=0; i<64; i+=1) {
            canvas[i] = [];
            for (var j=0; j<64; j+=1) {
                canvas[i][j] = "#FFFFFF";
            }
        }

        return canvas;
    }

    var state = {
        width: 512,
        height: 512,
        color: "#000000",
        canvas: canvasMaker(),
        history: []
    };

    render(state);

    addClickHandler(canvas, function(e) {
        state.history.push(JSON.parse(JSON.stringify(state.canvas)));

        var cell = getClickedCell(getRelativeMousePosition(e));
        state.canvas[cell[1]][cell[0]] = state.color;
        render(state);
    });

    addClickHandler(document.getElementById("pick-color"), function(e) {
        var color = "#" + document.getElementById("color-value").value;
        var validHex  = /^#[0-9A-F]{6}$/i.test(color);

        if (validHex) {
            state.color = color;
            return render(state);
        }
    });

}());

