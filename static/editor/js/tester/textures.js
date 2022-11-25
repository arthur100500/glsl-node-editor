let texture1 = null;
let texture2 = null;
let texture3 = null;
let texture4 = null;
let texture5 = null;

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
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel,
  );

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image,
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  };
  image.crossOrigin = 'anonymous';
  image.src = url;

  return texture;
}

const gl = glCanvas.getContext('webgl', { preserveDrawingBuffer: true }) || glCanvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
if (!gl) { alert('Your browser does not support WebGL'); }

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

texture1 = loadTexture(gl, 'https://media.discordapp.net/attachments/428611943692238848/1024805939485888553/unknown.png');
texture2 = loadTexture(gl, 'https://media.discordapp.net/attachments/428611943692238848/1024765490712809532/lava.png');
texture3 = loadTexture(gl, 'https://media.discordapp.net/attachments/428611943692238848/1024765707050819684/circle.png');
texture4 = loadTexture(gl, 'https://media.discordapp.net/attachments/428611943692238848/1024802613247627274/unknown.png');
texture5 = loadTexture(gl, 'https://media.discordapp.net/attachments/428611943692238848/1024804452609294417/WGL8MJeUWY82_jzVbYN16OIQa0dmoCEwUMCkZ66WFsCCtmCaFK5OEFmDLWc5VMtyWNIeANKALYwoaUuek3heYI9K.jpg');
