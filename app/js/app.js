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