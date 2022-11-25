// Taken from https://github.com/anvaka/panzoom

panzoom(mainEditorDiv, {
  beforeMouseDown(e) {
    const shouldIgnore = somethingIsBeingDragged | somethingIsBeingConnected;
    return shouldIgnore;
  },
});
