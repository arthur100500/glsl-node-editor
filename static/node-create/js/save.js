saveBtn.onmousedown = function () {
  const text = editor.getValue().replace(/ *\/\/([^\n]*) */g, '');

  const unifsNattribs = [];
  let lastIndex = 0;
  for (let i = 0; i < text.split('\n').length; i++) {
    if (text.split('\n')[i].startsWith('uniform') || text.split('\n')[i].startsWith('attrib')) {
      unifsNattribs.push(text.split('\n')[i]);
      lastIndex = i + 1;
    }
  }
  const actualText = (`${text}\n`).split('\n').slice(lastIndex, -1).join('\n');

  const node = nodeFromFunctionPr(actualText, unifsNattribs);

  const node_data = { name: node.name, json_code: editor.getValue(), id: nodeId };
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/save_node',
    data: node_data,
    success(response) {
      if (!(response === 'success')) {
        console.log(response);
      }
    },
    error(error) {
      console.log(error);
    },
  });
};
