panzoom(mainEditorDiv, {
    beforeMouseDown: function () {
        var shouldIgnore = Editor.somethingIsBeingDragged | Editor.somethingIsBeingConnected;
        return shouldIgnore;
    }
});
