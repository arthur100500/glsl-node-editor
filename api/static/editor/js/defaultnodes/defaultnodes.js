const getScrollLeft = () => { return (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft; }
const getScrollTop = () => { return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop; }


const getMatrix = () => {
    let matrixDevided = mainEditorDiv.style.transform.replace("matrix(", "").replace(")", "").split(", ");
    for (let i = 0; i < matrixDevided.length; i++)
        matrixDevided[i] = Number(matrixDevided[i]);
    return matrixDevided;
}

const nodeFactory = new NodeFactory()

const setNodesToContextMenu = (groupsNnodes) => {
    contextMenuNodes.innerHTML = '';
    let innerInnerDiv;
    let appendNodeDiv = document.createElement("div");
    document.querySelector("#new-node-btn").onmousedown = function () {
        if (appendNodeDiv.parentNode !== null)
            contextMenuNodes.removeChild(appendNodeDiv);
        else
            contextMenuNodes.appendChild(appendNodeDiv);
    }
    appendNodeDiv.id = "new-node-options";
    for (let i = 0; i < groupsNnodes.length; i++) {
        let innerDiv = document.createElement("div");
        innerDiv.id = "group" + i;
        innerDiv.className = "item-group";

        titleDiv = document.createElement("div");
        titleDiv.id = "group" + i + "title";
        titleDiv.className = "item";
        titleDiv.innerHTML = "<b>" + groupsNnodes[i][0] + "</b>";
        titleDiv.onmousedown = function () {
            for (const child of innerDiv.children) {
                child.className = child.className === "item-sml" ? "item-hidden" : "item-sml";
            }
        }
        appendNodeDiv.appendChild(titleDiv);

        // Change from 1 later
        for (let j = 1; j < groupsNnodes[i].length; j++) {
            innerInnerDiv = document.createElement("div");
            innerInnerDiv.id = "group" + i + "item" + j;
            innerInnerDiv.className = "item-hidden";
            innerInnerDiv.onmousedown = function () {
                Editor.allNodes.push(nodeFactory.nodeFromFunction(
                    groupsNnodes[i][j][0],
                    groupsNnodes[i][j][1] ? groupsNnodes[i][j][1] : [],
                    groupsNnodes[i][j][2] ? groupsNnodes[i][j][2] : []
                ));
                let xOff = nodeEditorDiv.getBoundingClientRect().left;
                let yOff = nodeEditorDiv.getBoundingClientRect().top;
                Editor.allNodes[Editor.allNodes.length - 1].positionX =
                    (mouseX - getMatrix()[4] + getScrollLeft() - xOff) / getMatrix()[0];
                Editor.allNodes[Editor.allNodes.length - 1].positionY =
                    (mouseY - getMatrix()[5] + getScrollTop() - yOff) / getMatrix()[3];
                Editor.allNodes[Editor.allNodes.length - 1].draw(mainEditorDiv);
            }
            innerInnerDiv.innerHTML = groupsNnodes[i][j][0].replace("(", " ").split(" ")[1].replaceAll("_", " ");
            innerDiv.appendChild(innerInnerDiv);
        }
        appendNodeDiv.appendChild(innerDiv);
    }
}

var stock =
    [
        ["Inputs",
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
        ["Outputs",

            [`
void colorOutput(vec4 color){
	gl_FragColor = color;
}
	`, []]], ["Math",

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
	`, []],

        ],

        ["Conversions",

            [`
float vec2_x(vec2 target){
	return target.x;
}
	`, []],

            [`
float vec2_y(vec2 target){
	return target.y;
}
	`, []],

            [`
float vec4_r(vec4 target){
	return target.r;
}
	`, []],

            [`
float vec4_g(vec4 target){
	return target.g;
}
	`, []],

            [`
float vec4_b(vec4 target){
	return target.b;
}
	`, []],

            [`
float vec4_a(vec4 target){
	return target.a;
}
	`, []],

            [`
vec4 fromFloatV4(float x, float y, float z, float w){
	return vec4(x, y, z, w);
}
	`, []],

            [`
vec2 fromFloatV2(float x, float y){
	return vec2(x, y);
}
	`, []],

        ],



        ["Constants",

            [`
float _float(){
	return value;
}
	`, [], ["float value"]],

            [`
vec2 _vec2(){
	return vec2(x, y);
}
	`, [], ["float x", "float y"]],

            [`
vec4 _vec4(){
	return vec4(r, g, b, w);
}
	`, [], ["float r", "float g", "float b", "float w"]],

            [`
int _int(){
	return value;
}
	`, [], ["int value"]]],

        ["Logic",

            [`
float multiplex(float valTrue, float valFalse, bool condition){
	if(condition){
		return valTrue;
	}
	return valFalse;
}
	`, []],
            [`
bool isBigger(float valLeft, float valRight){
	return valLeft > valRight;
}
	`, []]


        ], ["Textures",
            [`
vec4 _texture_0(vec2 coord){
	return texture2D(img0, coord);
}	
		`, ["uniform sampler2D img0;"]],
            [`
vec4 _texture_1(vec2 coord){
	return texture2D(img1, coord);
}	
		`, ["uniform sampler2D img1;"]],
            [`
vec4 _texture_2(vec2 coord){
	return texture2D(img2, coord);
}	
		`, ["uniform sampler2D img2;"]],
            [`
vec4 _texture_3(vec2 coord){
	return texture2D(img3, coord);
}	
		`, ["uniform sampler2D img3;"]],
            [`
vec4 _texture_4(vec2 coord){
	return texture2D(img4, coord);
}	
		`, ["uniform sampler2D img4;"]]
        ], ["Custom"
        ]
    ];


// Get nodes used by user
usedNodes = []
usedNodesMetas.forEach(e => usedNodes.push(e.dataset['usedNode']));
function formatNode(text) {
    text = text.replace(/ *\/\/([^\n]*) */g, "");
    let unifsNattribs = [];
    let lastIndex = 0
    for (let i = 0; i < text.split('\n').length; i++) {
        if (text.split('\n')[i].startsWith("uniform") || text.split('\n')[i].startsWith("attrib")) {
            unifsNattribs.push(text.split('\n')[i]);
            lastIndex = i + 1;
        }
    }
    let actualText = (text + "\n").split("\n").slice(lastIndex, -1).join("\n");
    return [actualText, unifsNattribs];
}
usedNodes.forEach(e => stock[7].push(formatNode(e)));

setNodesToContextMenu(stock);