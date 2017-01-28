

var renderer = new Renderer("renderCanvas");


document.getElementById("animateButton").onclick = interpolateStart;

function interpolateStart(){
	var duration = document.getElementById("animateDuration").value * 1;
	var startTime = Date.now();
	var reverse = false;

	interpolate();

	function interpolate(){

		var interpolation = (Date.now() - startTime) / duration;
		
		if(interpolation > 1){
			if(!reverse){
				applyTransforms(1);
				renderer.render();
				reverse = true;
				startTime = Date.now() + duration/10;
				setTimeout(interpolate, duration/10);
				return;
			} else {
				applyTransforms(0);
				renderer.render();
				return;
			}
		}

		var x = interpolation;
		var a = 1;
		interpolation = (Math.sqrt((1+a*a)/(1+a*a*Math.pow(Math.sin((x-0.5)*Math.PI),2)))*Math.sin((x-0.5)*Math.PI))/2+0.5;

		if(!reverse){
			applyTransforms(interpolation);
			renderer.render();
		} else {
			applyTransforms(1-interpolation);
			renderer.render();
		}

		window.requestAnimationFrame(interpolate);
	}
	
}

var transforms = [];

transforms.push({matrix:[
	 1, 0, 0, 0
	,0, 1, 0, 0
	,0, 0, 1, 0
	,0, 0, 0, 1
]});

document.getElementById("rotateXButton").onclick = function(){addTransform("rotateX");};
document.getElementById("rotateYButton").onclick = function(){addTransform("rotateY");};
document.getElementById("rotateZButton").onclick = function(){addTransform("rotateZ");};
document.getElementById("scaleButton").onclick = function(){addTransform("scale");};
document.getElementById("translateButton").onclick = function(){addTransform("translate");};
document.getElementById("perspectiveButton").onclick = function(){addTransform("perspective");};

var transformsContainer = document.getElementById("appliedTransforms");

var cos = Math.cos;
var sin = Math.sin;

function applyTransforms(interpolation){
	for(var i in transforms){
		var a = transforms[i].value;
		
		switch(transforms[i].type){
			case "rotateX":
				a = a*(1-interpolation);
				transforms[i].matrix = [
					1,       0,        0,     0,
					0,  cos(a),  -sin(a),     0,
					0,  sin(a),   cos(a),     0,
					0,       0,        0,     1
				];
			break;
			case "rotateY":
				a = a*(1-interpolation);
				transforms[i].matrix = [
					 cos(a),   0, sin(a),   0,
						  0,   1,      0,   0,
					-sin(a),   0, cos(a),   0,
						  0,   0,      0,   1
				];
			break;
			case "rotateZ":
				a = a*(1-interpolation);
				transforms[i].matrix = [
					cos(a), -sin(a),    0,    0,
					sin(a),  cos(a),    0,    0,
						 0,       0,    1,    0,
						 0,       0,    0,    1
				];
			break;
			case "scale":
				console.log(a);
				x = a.x*(1-interpolation) + interpolation;
				y = a.y*(1-interpolation) + interpolation;
				z = a.z*(1-interpolation) + interpolation;
				transforms[i].matrix[0] = x;
				transforms[i].matrix[5] = y;
				transforms[i].matrix[10] = z;
			break;
			case "translate":
				x = a.x*(1-interpolation);
				y = a.y*(1-interpolation);
				z = a.z*(1-interpolation);
				transforms[i].matrix[12] = x;
				transforms[i].matrix[13] = y;
				transforms[i].matrix[14] = z;
			break;
			case "perspective":
				x = a.x*(1-interpolation);
				y = a.y*(1-interpolation);
				z = a.z*(1-interpolation);
				transforms[i].matrix[3] = x;
				transforms[i].matrix[7] = y;
				transforms[i].matrix[11] = z;
			break;
		}
	}
}

function addTransform(type){

	var container = document.createElement("div");
	container.className = "transform";
	//container.innerHTML = type;

	var value = 0;
	if(type == "translate" || type == "perspective"){
		value = {
			 x: 0
			,y: 0
			,z: 0
		};
	}
	if(type == "scale"){
		value = {
			 x: 1
			,y: 1
			,z: 1
		};
	}

	var transform = {
		matrix: [
			 1, 0, 0, 0
			,0, 1, 0, 0
			,0, 0, 1, 0
			,0, 0, 0, 1
		]
		,type: type
		,value: value
	};

	transforms.push(transform);
	
	var toolbar = document.createElement("div");
	toolbar.className = "transform-toolbar";

	var deleteButton = document.createElement("button");
	deleteButton.innerHTML = '<img src="./icons/delete.svg" alt="x" title="Delete">';
	deleteButton.onclick = function(){
		transformsContainer.removeChild(container);
		
		transforms.splice(transforms.indexOf(transform), 1);
		renderer.render();

		fixButtonEnabling();
	};
	toolbar.appendChild(deleteButton);

	var upButton = document.createElement("button");
	upButton.innerHTML = '<img src="./icons/arrowup.svg" alt="^" title="Move Up">';
	upButton.className = 'upButton';
	upButton.onclick = function(){
		var before = container.previousSibling;
		transformsContainer.removeChild(container);
		transformsContainer.insertBefore(container, before);

		var index = transforms.indexOf(transform);
		transforms.splice(index, 1);
		transforms.splice(index-1, 0, transform);
		renderer.render();

		fixButtonEnabling();
	};
	toolbar.appendChild(upButton);

	var downButton = document.createElement("button");
	downButton.innerHTML = '<img src="./icons/arrowdown.svg" alt="v" title="Move Down">';
	downButton.className = 'downButton';
	downButton.onclick = function(){
		var after = container.nextSibling;
		transformsContainer.removeChild(container);
		transformsContainer.insertBefore(container, after.nextSibling);

		var index = transforms.indexOf(transform);
		transforms.splice(index, 1);
		transforms.splice(index+1, 0, transform);
		renderer.render();

		fixButtonEnabling();
	};
	toolbar.appendChild(downButton);

	function fixButtonEnabling(){
		var upButtons = document.getElementsByClassName("upButton");
		for(var i in upButtons){
			upButtons[i].disabled = false;
		}
		if(upButtons[0]){
			upButtons[0].disabled = true;
		}

		var downButtons = document.getElementsByClassName("downButton");
		for(var i in downButtons){
			downButtons[i].disabled = false;
		}
		if(downButtons[downButtons.length-1]){
			downButtons[downButtons.length-1].disabled = true;
		}

		if(transforms.length > 1){
			document.getElementById("usageHint").style.display = "none";
		} else {
			document.getElementById("usageHint").style.display = "inline";
		}

		console.log(transforms.length);
	}

	container.appendChild(toolbar);

	switch(type){
		case "rotateX":
			var label = document.createElement("label");
			label.innerHTML = "X rotation: 0°";
			
			var angleSlider = document.createElement("input");
			angleSlider.type = "range";
			angleSlider.min = "-3.1415";
			angleSlider.max = "3.1415";
			angleSlider.step = "0.01";
			angleSlider.value = "0";

			container.appendChild(label);
			container.appendChild(angleSlider);

			angleSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix = [
					1,       0,        0,     0,
					0,  cos(a),  -sin(a),     0,
					0,  sin(a),   cos(a),     0,
					0,       0,        0,     1
				];
				transform.value = a;
				label.innerHTML = "X rotation: "+Math.round(180*a/Math.PI)+"°";
				renderer.render();
			}
		break;
		case "rotateY":
			var label = document.createElement("label");
			label.innerHTML = "Y rotation: 0°";
			
			var angleSlider = document.createElement("input");
			angleSlider.type = "range";
			angleSlider.min = "-3.1415";
			angleSlider.max = "3.1415";
			angleSlider.step = "0.01";
			angleSlider.value = "0";

			container.appendChild(label);
			container.appendChild(angleSlider);

			angleSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix = [
					 cos(a),   0, sin(a),   0,
						  0,   1,      0,   0,
					-sin(a),   0, cos(a),   0,
						  0,   0,      0,   1
				];
				transform.value = a;
				label.innerHTML = "Y rotation: "+Math.round(180*a/Math.PI)+"°";
				renderer.render();
			}
		break;
		case "rotateZ":
			var label = document.createElement("label");
			label.innerHTML = "Z rotation: 0°";
			
			var angleSlider = document.createElement("input");
			angleSlider.type = "range";
			angleSlider.min = "-3.1415";
			angleSlider.max = "3.1415";
			angleSlider.step = "0.01";
			angleSlider.value = "0";

			container.appendChild(label);
			container.appendChild(angleSlider);

			angleSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix = [
					cos(a), -sin(a),    0,    0,
					sin(a),  cos(a),    0,    0,
						 0,       0,    1,    0,
						 0,       0,    0,    1
				];
				transform.value = a;
				label.innerHTML = "Z rotation: "+Math.round(180*a/Math.PI)+"°";
				renderer.render();
			}
		break;
		case "scale":
			var xLabel = document.createElement("label");
			xLabel.innerHTML = "X scale factor: 1";
			
			var xSlider = document.createElement("input");
			xSlider.type = "range";
			xSlider.min = "-1";
			xSlider.max = "3";
			xSlider.step = "0.01";
			xSlider.value = "1";

			container.appendChild(xLabel);
			container.appendChild(xSlider);

			xSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[0] = a;
				transform.value.x = a;
				xLabel.innerHTML = "X scale factor: "+Math.round(a*100)/100;
				renderer.render();
			}

			var yLabel = document.createElement("label");
			yLabel.innerHTML = "Y scale factor: 1";
			
			var ySlider = document.createElement("input");
			ySlider.type = "range";
			ySlider.min = "-1";
			ySlider.max = "3";
			ySlider.step = "0.01";
			ySlider.value = "1";

			container.appendChild(yLabel);
			container.appendChild(ySlider);

			ySlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[5] = a;
				transform.value.y = a;
				yLabel.innerHTML = "Y scale factor: "+Math.round(a*100)/100;
				renderer.render();
			}

			var zLabel = document.createElement("label");
			zLabel.innerHTML = "Z scale factor: 1";
			
			var zSlider = document.createElement("input");
			zSlider.type = "range";
			zSlider.min = "-1";
			zSlider.max = "3";
			zSlider.step = "0.01";
			zSlider.value = "1";

			container.appendChild(zLabel);
			container.appendChild(zSlider);

			zSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[10] = a;
				transform.value.z = a;
				zLabel.innerHTML = "Z scale factor: "+Math.round(a*100)/100;
				renderer.render();
			}
		break;
		case "translate":
			var xLabel = document.createElement("label");
			xLabel.innerHTML = "X translation: 0";
			
			var xSlider = document.createElement("input");
			xSlider.type = "range";
			xSlider.min = "-2";
			xSlider.max = "2";
			xSlider.step = "0.01";
			xSlider.value = "0";

			container.appendChild(xLabel);
			container.appendChild(xSlider);

			xSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[12] = a;
				transform.value.x = a;
				xLabel.innerHTML = "X translation: "+Math.round(a*100)/100;
				renderer.render();
			}

			var yLabel = document.createElement("label");
			yLabel.innerHTML = "Y translation: 0";
			
			var ySlider = document.createElement("input");
			ySlider.type = "range";
			ySlider.min = "-2";
			ySlider.max = "2";
			ySlider.step = "0.01";
			ySlider.value = "0";

			container.appendChild(yLabel);
			container.appendChild(ySlider);

			ySlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[13] = a;
				transform.value.y = a;
				yLabel.innerHTML = "Y translation: "+Math.round(a*100)/100;
				renderer.render();
			}

			var zLabel = document.createElement("label");
			zLabel.innerHTML = "Z translation: 0";
			
			var zSlider = document.createElement("input");
			zSlider.type = "range";
			zSlider.min = "-2";
			zSlider.max = "2";
			zSlider.step = "0.01";
			zSlider.value = "0";

			container.appendChild(zLabel);
			container.appendChild(zSlider);

			zSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[14] = a;
				transform.value.z = a;
				zLabel.innerHTML = "Z translation: "+Math.round(a*100)/100;
				renderer.render();
			}
		break;
		case "perspective":
			var xLabel = document.createElement("label");
			xLabel.innerHTML = "X vanishing point: 0";
			
			var xSlider = document.createElement("input");
			xSlider.type = "range";
			xSlider.min = "-1";
			xSlider.max = "1";
			xSlider.step = "0.01";
			xSlider.value = "0";

			container.appendChild(xLabel);
			container.appendChild(xSlider);

			xSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[3] = a;
				transform.value.x = a;
				xLabel.innerHTML = "X vanishing point: "+Math.round(a*100)/100;
				renderer.render();
			}

			var yLabel = document.createElement("label");
			yLabel.innerHTML = "Y vanishing point: 0";
			
			var ySlider = document.createElement("input");
			ySlider.type = "range";
			ySlider.min = "-1";
			ySlider.max = "1";
			ySlider.step = "0.01";
			ySlider.value = "0";

			container.appendChild(yLabel);
			container.appendChild(ySlider);

			ySlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[7] = a;
				transform.value.y = a;
				yLabel.innerHTML = "Y vanishing point: "+Math.round(a*100)/100;
				renderer.render();
			}

			var zLabel = document.createElement("label");
			zLabel.innerHTML = "Z vanishing point: 0";
			
			var zSlider = document.createElement("input");
			zSlider.type = "range";
			zSlider.min = "-2";
			zSlider.max = "2";
			zSlider.step = "0.01";
			zSlider.value = "0";

			container.appendChild(zLabel);
			container.appendChild(zSlider);

			zSlider.oninput = function(){
				var a = this.value*1;
				transform.matrix[11] = a;
				transform.value.z = a;
				zLabel.innerHTML = "Z vanishing point: "+Math.round(a*100)/100;
				renderer.render();
			}
		break;
	}

	transformsContainer.appendChild(container);
	fixButtonEnabling();
	
}









