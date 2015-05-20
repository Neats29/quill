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
  color: "#000000",
  canvas: canvasMaker(),
  history: []
};

addClickHandler(document.getElementById("canvas"), function (e) {
  var cell = editor.getClickedCell(e);
  state.history.push(JSON.parse(JSON.stringify(state.canvas)));

  state.canvas[cell[1]][cell[0]] = state.color;

  render(state);
});

addClickHandler(document.getElementById("pick-color"), function () {
  var color = "#" + document.getElementById("color-value").value;
  var validHex  = /^#[0-9A-F]{6}$/i.test(color);

  if (validHex) {
    state.color = color;
  }
});

addClickHandler(document.getElementById("rubber"), function() {
	state.color = "#FFFFFF";
});


addClickHandler(document.getElementById("e71b1b"), function() {
	state.color = "#e71b1b";

});

addClickHandler(document.getElementById("3639E0"), function() {
	state.color = "#3639E0";

});

addClickHandler(document.getElementById("89e71b"), function() {
	state.color = "#89e71b";

});

addClickHandler(document.getElementById("000000"), function() {
	state.color = "#000000";

});

addClickHandler(document.getElementById("thick"), function() {
	editor.colorCells();

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
})

render(state);