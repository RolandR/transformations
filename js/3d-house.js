var canvas = document.getElementById("renderCanvas");

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var size = Math.min(width, height);

canvas.width = size;
canvas.height = size;

generate3dHouse();

function generate3dHouse(){

	//canvas.width

	var vertices = [];
	var colors = [];

	function rect(x0, y0, z0, x1, y1, z1, color){
		vertices.push(x0, y0, z0);
		vertices.push(x0, y1, z1);
		vertices.push(x1, y1, z0);

		vertices.push(x0, y0, z1);
		vertices.push(x1, y0, z0);
		vertices.push(x1, y1, z1);

		var n = 6;
		while(n--){
			colors.push(color[0], color[1], color[2]);
		}
	}

	rect(-0.5, -0.5, -0.5,
		 -0.5, 0.5, 0.5,
		[1, 0, 0]);

	rect(0.5, -0.5, -0.5,
		 0.5, 0.5, 0.5,
		[1, 1, 0]);

	rect(0.5, 0.5, -0.5,
		 -0.5, -0.5, -0.5,
		[0, 1, 0]);

	rect(0.5, 0.5, 0.5,
		 -0.5, -0.5, 0.5,
		[0, 1, 1]);

	rect(-0.5, -0.5, -0.5,
		  0.5, -0.5, 0.5,
		[0, 0, 1]);

	rect(-0.5, 0.5, -0.5,
		  0.5, 0.5, 0.5,
		[1, 0, 1]);

	console.log(vertices.length);
	console.log(colors.length);
	console.log(colors);

	vertices = Float32Array.from(vertices);
	colors = Float32Array.from(colors);

	renderer.addVertices(vertices, colors);

	renderer.render(false);

}





