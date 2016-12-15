var vertexShader = `

uniform mat4 transform;
uniform mat4 normalTransform;
uniform float aspect;

attribute vec3 coordinates;
attribute vec3 vertexNormal;

varying highp vec3 lighting;

void main(void){

	highp vec3 ambientLight = vec3(0.2, 0.2, 0.2);
    highp vec3 directionalLightColor = vec3(2.0, 2.0, 2.0);
    highp vec3 directionalVector = vec3(-5.0, 10.0, -5.0);

    vec4 normal = normalTransform * vec4(vertexNormal, 1.0);

	highp float directional = max(dot(normal.xyz, directionalVector), 0.0);
    lighting = ambientLight + (directionalLightColor * directional);

	vec4 coords = vec4(coordinates, 1.0);

	coords = transform * coords;

	coords = coords/coords.w;

	coords.y = coords.y * aspect;

	gl_Position = coords;
}

`;
