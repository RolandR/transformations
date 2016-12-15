
function calculateNormals(points){
	var normals = [];
	var normal;
	for(var i = 0; i < points.length; i += 9){
		normal = calculateNormal(points.slice(i, i+9));
		normals = normals.concat(normal);
		normals = normals.concat(normal);
		normals = normals.concat(normal);
	}

	return normals;
}

function calculateNormal(triangle){
	var p1 = [triangle[0], triangle[1], triangle[2]];
	var p2 = [triangle[3], triangle[4], triangle[5]];
	var p3 = [triangle[6], triangle[7], triangle[8]];
	
	var u = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
	var v = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];

	return [
		u[1]*v[2] - u[2]*v[1],
		u[2]*v[0] - u[0]*v[2],
		u[0]*v[1] - u[1]*v[0]
	];
}