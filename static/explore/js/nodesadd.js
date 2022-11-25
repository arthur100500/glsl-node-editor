function changeStyle(t) {
  console.log(t);
  if (t.className === 'used') {
    t.className = 'unused';
    t.innerHTML = '<span> Use </span>';
  } else {
    t.className = 'used';
    t.innerHTML = '<span> Used </span>';
  }
}

function addNodeAjaxWID(pid, callback, t) {
  let txt = 'add';
  if (t.innerHTML.includes('Used')) { txt = 'rem'; }

  $.ajax({
    type: 'POST',
    dataType: 'data',
    url: `/${txt}_node/${pid}`,
    success(response) {
      if ((response === 'success')) {
        callback(t);
      }
    },
    error(error) {
      if ((error.responseText === 'success')) {
        callback(t);
      }
    },
  });
}
