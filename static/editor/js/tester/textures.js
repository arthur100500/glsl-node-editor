var texture1 = null;
var texture2 = null;
var texture3 = null;
var texture4 = null;
var texture5 = null;

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
    width, height, border, srcFormat, srcType,
    pixel);

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      srcFormat, srcType, image);


    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  };
  image.crossOrigin = "anonymous";
  image.src = url;

  return texture;
}

function loadTextures() {
  const gl = glCanvas.getContext("webgl", { preserveDrawingBuffer: true }) || glCanvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
  if (!gl)
    alert("Your browser does not support WebGL");

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const pid = document.querySelector("#project-id").dataset.projectId

  texture1 = loadTexture(gl, '/pimg/' + pid + '/0');
  texture2 = loadTexture(gl, '/pimg/' + pid + '/1');
  texture3 = loadTexture(gl, '/pimg/' + pid + '/2');
  texture4 = loadTexture(gl, '/pimg/' + pid + '/3');
  texture5 = loadTexture(gl, '/pimg/' + pid + '/4');
  texture6 = loadTexture(gl, '/pimg/' + pid + '/5');
  texture7 = loadTexture(gl, '/pimg/' + pid + '/6');
  texture8 = loadTexture(gl, '/pimg/' + pid + '/7');
}

loadTextures();
