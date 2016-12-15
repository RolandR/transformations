var canvas = document.getElementById("renderCanvas");

var width = document.getElementById("canvasContainer").clientWidth;
var height = document.getElementById("canvasContainer").clientHeight;

canvas.width = width;
canvas.height = height;

init();

function init(){

	var vertices = Float32Array.from(teapot);

	var normals = Float32Array.from(calculateNormals(teapot));

	console.log(vertices.length, normals.length);

	renderer.addVertices(vertices, normals);

	renderer.render();

}

