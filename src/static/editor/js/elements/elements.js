const glCanvas = document.querySelector("#gl-canvas");
const mainEditorDiv = document.querySelector("#main-editor");
const contextMenu = document.querySelector("#context-menu");
const contextMenuNodes = document.querySelector("#node-list-div");

const openCloseTriangle = document.querySelector("#oc-triangle");
const pageLayoutDiv = document.querySelector("#page-layout");

const compileButton = document.querySelector("#compile-button");
const saveShButton = document.querySelector("#save-as-shader-button");
const savePrButton = document.querySelector("#save-as-project-button");
const sortPrButton = document.querySelector("#sort-button");

const prName = document.querySelector(".pr-name")
const prDesc = document.querySelector(".pr-desc")

const nodeEditorDiv = document.querySelector("#node-editor");

const usedNodesMetas = document.querySelectorAll(".used-nodes");