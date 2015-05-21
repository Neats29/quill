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
	},


	//drawing without letting go of the mouse
	mouseMoved: function(e) {
		var x, y;
		x = e.clientX;
		y = e.clientY;
	},

	mouseDown: function(e) {
		e.target.setCapture();
		e.addEventListener("mousemove", this.mouseMoved, false);
	},

	mouseUp: function(e) {
		e.target.removeEventListener("mousemove", this.mouseMoved, false);
	}

};

module.exports = Canvas;