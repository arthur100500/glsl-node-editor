const vertShader =
    `
precision mediump float;
attribute vec2 aPosition;
attribute vec2 aTexCoord;

varying vec2 texCoord;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    texCoord = aTexCoord;
}`;

var fragShader =
    `precision mediump float;
varying vec2 texCoord;

void main(){
	gl_FragColor = vec4(vec3(1.0), 1.0);
}
`

const resize = () => {
    glCanvas.width = window.innerWidth;
    glCanvas.height = window.innerHeight;
}

glCanvas.onresize = resize;
resize();

function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        throw `Could not compile WebGL program.\n\n${sourceCode} \n\n${info}`;
    }
    return shader;
}

function createProgram(gl) {
    var vertexShader = createShader(gl, vertShader, gl.VERTEX_SHADER);
    var fragmentShader = createShader(gl, fragShader, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        throw `Could not compile WebGL program. \n\n${info}`;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    var VBO = gl.createBuffer();
    var EBO = gl.createBuffer();

    return program;
}

function draw(glCanvas) {
    const gl = glCanvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl)
        alert("Your browser does not support WebGL");

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.75, 0.44, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	let isCompiled = false;
	let prog = null;
	try{
		prog = createProgram(gl);
		isCompiled = true;
	}
	catch (err){
		//alertError(err);
	}

	if (isCompiled){
		compileButton.className = "control-btn-green";
		setTimeout(() => {compileButton.className = "control-btn";}, 200)
	}
	else{
		compileButton.className = "control-btn-red";
		setTimeout(() => {compileButton.className = "control-btn";}, 200)
		return;
	}

    let quadPoints = new Float32Array([
        -1, -1,  0,  0,
         1, -1,  1,  0,
        -1,  1,  0,  1,
         1,  1,  1,  1,
         1, -1,  1,  0,
        -1,  1,  0,  1
    ]);

    let quadIndexes = new Int32Array([0, 1, 3, 2, 1, 3]);

    var VBO = gl.createBuffer();
    var EBO = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, quadPoints, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quadIndexes, gl.STATIC_DRAW);

    gl.useProgram(prog);

    var aPosLocation = gl.getAttribLocation(prog, 'aPosition');
    gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.enableVertexAttribArray(aPosLocation);

    var aPosLocation = gl.getAttribLocation(prog, 'aTexCoord');
    gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
    gl.enableVertexAttribArray(aPosLocation);

    let timeBegin = new Date().getTime();
    let timeUniLoc = gl.getUniformLocation(prog, "time");
    let mouseUniLoc = gl.getUniformLocation(prog, "mousePosition");
	
    let timeD = 0;
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, texture3);
	
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, texture4);
	
	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, texture5);
	
	let imgUniLoc0 = gl.getUniformLocation(prog, "img0");
	let imgUniLoc1 = gl.getUniformLocation(prog, "img1");
	let imgUniLoc2 = gl.getUniformLocation(prog, "img2");
	let imgUniLoc3 = gl.getUniformLocation(prog, "img3");
	let imgUniLoc4 = gl.getUniformLocation(prog, "img4");

	gl.uniform1i(imgUniLoc0, 0);
	gl.uniform1i(imgUniLoc1, 1);
	gl.uniform1i(imgUniLoc2, 2);
	gl.uniform1i(imgUniLoc3, 3);
	gl.uniform1i(imgUniLoc4, 4);
	
    function updateAndRedraw() {
        timeD = new Date().getTime() - timeBegin;

        gl.uniform1f(timeUniLoc, timeD / 1000.0);

        gl.uniform2f(mouseUniLoc, mouseX / window.innerWidth, mouseY / window.innerHeight);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        setTimeout(function () { window.requestAnimationFrame(updateAndRedraw) }, 1);
    }

    updateAndRedraw();
}

glCanvas.setAttribute('crossOrigin','anonymous');
draw(glCanvas);