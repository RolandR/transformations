
function Renderer(canvasId){

	var canvas = document.getElementById(canvasId);

	
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

	var shaderProgram;
	var size;

	var vertexBuffer;
	var normalsBuffer;

	var transformMatrixRef;
	var normalTransformRef;
	var aspectRef;
	
	init();

	function init(){

		gl.enable(gl.DEPTH_TEST);

		//gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		//gl.enable(gl.BLEND);

		/*=========================Shaders========================*/

		// Create a vertex shader object
		var vertShader = gl.createShader(gl.VERTEX_SHADER);

		// Attach vertex shader source code
		gl.shaderSource(vertShader, vertexShader);

		// Compile the vertex shader
		gl.compileShader(vertShader);

		// Create fragment shader object
		var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

		// Attach fragment shader source code
		gl.shaderSource(fragShader, fragmentShader);

		// Compile the fragmentt shader
		gl.compileShader(fragShader);

		// Create a shader program object to store
		// the combined shader program
		shaderProgram = gl.createProgram();

		// Attach a vertex shader
		gl.attachShader(shaderProgram, vertShader); 

		// Attach a fragment shader
		gl.attachShader(shaderProgram, fragShader);

		// Link both programs
		gl.linkProgram(shaderProgram);

		// Use the combined shader program object
		gl.useProgram(shaderProgram);

		console.log(gl.getShaderInfoLog(vertShader));
		console.log(gl.getShaderInfoLog(fragShader));
		console.log(gl.getProgramInfoLog(shaderProgram));


		vertexBuffer = gl.createBuffer();
		normalsBuffer = gl.createBuffer();
		//colorBuffer = gl.createBuffer();
		
	}

	function addVertices(vertices, normals){

		/*==========Defining and storing the geometry=======*/

		size = ~~(vertices.length/3);

		//gl.deleteBuffer(vertexBuffer);
		//vertexBuffer = gl.createBuffer();

		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		
		var coord = gl.getAttribLocation(shaderProgram, "coordinates");
		gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(coord);
		

		gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
		
		var normal = gl.getAttribLocation(shaderProgram, "vertexNormal");
		gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(normal);

		transformMatrixRef = gl.getUniformLocation(shaderProgram, "transform");
		normalTransformRef = gl.getUniformLocation(shaderProgram, "normalTransform");
		aspectRef = gl.getUniformLocation(shaderProgram, "aspect");

	}
	
	function render(){

		/*if(!interpolation){
			interpolation = 0;
		}

		var identityMatrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];*/

		//console.table(transforms);

		var transformsArray = [];
		for(var i in transforms){
			transformsArray.push(transforms[i].matrix);
		}

		var transformMatrix = multiplyArrayOfMatrices(transformsArray).slice();

		/*for(var i in transformMatrix){
			transformMatrix[i] = transformMatrix[i] * (1-interpolation) + identityMatrix[i] * interpolation;
		}*/
		
		var normalsMatrix = normalMatrix(transformMatrix);

		gl.uniformMatrix4fv(transformMatrixRef, false, transformMatrix);
		gl.uniformMatrix4fv(normalTransformRef, false, normalsMatrix);
		gl.uniform1f(aspectRef, canvas.width/canvas.height);

		// Clear the canvas
		gl.clearColor(0, 0, 0, 0);
		
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Draw the triangle
		gl.drawArrays(gl.TRIANGLES, 0, size);
	}

	return{
		 addVertices: addVertices
		,render: render
	};

}
