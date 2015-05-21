(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function Canvas (element,w,h) {
	this.width = w;
	this.height = h;

	this.canvas = element;
	this.canvas.width = w;
	this.canvas.height = h;
	this.ctx = element.getContext("2d");
}

Canvas.prototype = {

	setSize: function (w,h) {
		this.canvas.width = w;
		this.canvas.height = h;
	},

	setCellsPerSide: function(n) {
		this.cellsPerSide = n;
	},

	traceLine: function (x1,y1,x2,y2) {
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
	},

	drawLine: function (colour) {
		this.ctx.strokeStyle = colour;
		this.ctx.stroke();
	},

	traceGrid: function () {
		var w = this.width;
		var cellLength = w/this.cellsPerSide;

		for (var x = 0; x < w; x += cellLength){
			this.traceLine(x, 0, x, w);
			this.traceLine(0, x, w, x);
		}

	},

	colorCells: function (cellGrid) {
		var cellLength = this.width/this.cellsPerSide;

		cellGrid.forEach(function(row, rownum) {
	    row.forEach(function(cell, colnum) {
        this.ctx.fillStyle = cell;
        this.ctx.fillRect((colnum*cellLength), (rownum*cellLength), cellLength, cellLength);
		   }, this);
		}, this);
	},

	draw: function (cellGrid) {
		this.colorCells(cellGrid, this.width, this.height);
		this.traceGrid(this.width, this.height);
		this.drawLine("#eee");
	},

	getRelativeMousePosition: function (e) {
		var x, y;

		if (e.pageX !== undefined && e.pageY !== undefined) {
		    x = e.pageX;
		    y = e.pageY;
		} else {
		    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		x -= this.canvas.offsetLeft;
		y -= this.canvas.offsetTop;

		return [x, y];
	},

	getCellAtPosition: function (coords) {
		var cellLength = this.width/this.cellsPerSide;

    var x = Math.floor(coords[0]/cellLength);
    var y = Math.floor(coords[1]/cellLength);

    return [x, y];
	},

	getClickedCell: function(e) {
		return this.getCellAtPosition(this.getRelativeMousePosition(e));
	}

};

module.exports = Canvas;
},{}],2:[function(require,module,exports){
"use strict";

var Canvas = require("./Canvas");

var editor = new Canvas(document.getElementById("canvas"), 512, 512);
var flipbook = new Canvas(document.getElementById("flipbook"), 512, 512);


function addClickHandler(element, callback) {
    element.addEventListener("click", callback);
}

function render(state) {
  editor.setSize(state.width, state.height);
  editor.setCellsPerSide(64);
  editor.draw(state.canvas, state.width, state.height);
  flipbook.setSize(state.width, state.height);
  flipbook.setCellsPerSide(64);
  flipbook.draw(state.canvas, state.width, state.height);
}

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

//--------------------

var state = {
  width: 512,
  height: 512,
	brushSize: 1,
  color: "#000000",
  canvas: canvasMaker(),
  history: []
};

addClickHandler(document.getElementById("canvas"), function (e) {
  var cell = editor.getClickedCell(e);
  state.history.push(JSON.parse(JSON.stringify(state.canvas)));

	for (var i = 0; i < state.brushSize; i+=1) {
		var y = cell[1];
		var x = cell[0] + i > 64 ? cell[0] : cell[0] + i;

		state.canvas[y][x] = state.color;
	}

  render(state);
});

addClickHandler(document.getElementById("pick-color"), function () {
  var color = "#" + document.getElementById("color-value").value;
  var validHex  = /^#[0-9A-F]{6}$/i.test(color);

  if (validHex) {
		var div = document.createElement('div');
		document.getElementById("colors").appendChild(div);
		div.style.backgroundColor = color;
		div.style.height = "15px";
		div.style.width = "15px";
    changeColor(color);
  }
});

function changeColor(color) {
	state.color = color;
}

function clickOnTool (id, color) {
	addClickHandler(document.getElementById(id), function() {
		changeColor(color);
	});
}


addClickHandler(document.getElementById("colorPicker"), function (){
	addClickHandler(document.getElementById("addColor"), function (){
		var selectedColor = document.getElementById("colorPicker").value;
		var div = document.createElement('div');
		document.getElementById("colors").appendChild(div);
		div.style.backgroundColor = selectedColor;
		div.style.height = "15px";
		div.style.width = "15px";
		changeColor(selectedColor);

	});
});


addClickHandler(document.getElementById("thick"), function() {
	state.brushSize = 2;
});

addClickHandler(document.getElementById("play"), function () {

	var historyCounter = state.history.length - 1;

	function replayDrawing(n) {
		if(n>historyCounter) return;
		flipbook.draw(state.history[n]);

		setTimeout(function(){
			replayDrawing(n+1);
		}, 400)
	}

	replayDrawing(0);

});

addClickHandler(document.getElementById("undo"), function () {
	if (state.history.length < 1) return;

	var lastCanvas = state.history.pop();
	state.canvas = lastCanvas;
	render(state);
});

clickOnTool("rubber", "#FFFFFF");
clickOnTool("red", "#e71b1b");
clickOnTool("blue", "#3639E0");
clickOnTool("green", "#89e71b");
clickOnTool("black", "#000000");

render(state);
},{"./Canvas":1}]},{},[2]);
