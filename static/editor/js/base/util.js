const glCanvas = document.querySelector("#gl-canvas");
const mainEditorDiv = document.querySelector("#main-editor");
const contextMenu = document.querySelector("#context-menu");
const contextMenuNodes = document.querySelector("#node-list-div");

const openCloseTriangle = document.querySelector("#oc-triangle");
const pageLayoutDiv = document.querySelector("#page-layout");

const compileButton = document.querySelector("#compile-button");
const saveShButton = document.querySelector("#save-as-shader-button");
const savePrButton = document.querySelector("#save-as-project-button");
const loadPrButton = document.querySelector("#load-project-button");

const prName = document.querySelector(".pr-name")
const prDesc = document.querySelector(".pr-desc")

const nodeEditorDiv = document.querySelector("#node-editor");

const usedNodesMetas = document.querySelectorAll(".used-nodes");

var mouseX = 0;
var mouseY = 0;

var somethingIsBeingDragged = false;
var somethingIsBeingConnected = false;

var getScrollLeft = function(){return (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;}
var getScrollTop = function(){return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;}

var getMatrix = function(){
  let matrixDevided = mainEditorDiv.style.transform.replace("matrix(", "").replace(")", "").split(", ");
  for(let i = 0; i < matrixDevided.length; i++)
    matrixDevided[i] = Number(matrixDevided[i]);
  return matrixDevided;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

prName.spellcheck = false;
prDesc.spellcheck = false;