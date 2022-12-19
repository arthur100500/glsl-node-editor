export default function getDefaults() {
    return {
        "Inputs": [
            [`
float texCoordX(){
	return texCoord.x;
}
	`, ["varying vec2 texCoord;"]],

            [`
float texCoordY(){
	return texCoord.y;
}
	`, ["varying vec2 texCoord;"]],

            [`
vec2 texCoord_(){
	return texCoord;
}
	`, ["varying vec2 texCoord;"]],

            [`
float _time(){
	return time;
}
	`, ["uniform float time;"]],

            [`
vec2 mousePos() {
	return mousePosition;
}
	`, ['uniform vec2 mousePosition;']]],
        "Outputs": [
            [`
void colorOutput(vec4 color){
	gl_FragColor = color;
}
	`, []]],

        'Math': [

            [`
float _sin(float argument){
	return sin(argument);
}
	`, []],

            [`
float _pow(float argument, float power){
	return pow(argument, power);
}
	`, []],

            [`	
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}`, []],

            [`
float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}
	`, []],

            [`
float avg(float a, float b, float c, float d){
	return (a + b + c + d) / 4.0;
}
	`, []],

            [`
float multiplyff(float a, float b){
	return a * b;
}
	`, []],

            [`
vec2 multiplyv2f(vec2 a, float b){
	return a * b;
}
	`, []],

            [`
vec4 multiplyv4f(vec4 a, float b){
	return a * b;
}
	`, []],

            [`
float plus(float a, float b){
	return a + b;
}
	`, []],

            [`
vec2 plusv2(vec2 a, vec2 b){
	return a + b;
}
	`, []],

            [`
vec4 plusv4(vec4 a, vec4 b){
	return a + b;
}
	`, []],

            [`
float minus(float a, float b){
	return a - b;
}
	`, []]]
    }
}