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

addClickHandler(document.getElementById("canvas"), function(e) {
  var cell = editor.getClickedCell(e);
  state.canvas[cell[1]][cell[0]] = state.color;
  state.history.push(JSON.parse(JSON.stringify(state.canvas)));

  render(state);
});

addClickHandler(document.getElementById("pick-color"), function(e) {
  var color = "#" + document.getElementById("color-value").value;
  var validHex  = /^#[0-9A-F]{6}$/i.test(color);

  if (validHex) {
    state.color = color;
    render(state);
  }
});

addClickHandler(document.getElementById("play"), function(e) {
	state.history.forEach(function(e) {
		setTimeout(function() {
			flipbook.draw(e, state.width, state.height);
		}, 400);
	});
});

render(state);