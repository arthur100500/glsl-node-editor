// Taken from https://github.com/anvaka/panzoom


panzoom(mainEditorDiv, {
  beforeMouseDown: function(e) {
    var shouldIgnore = somethingIsBeingDragged | somethingIsBeingConnected;
    return shouldIgnore;
  }
});


