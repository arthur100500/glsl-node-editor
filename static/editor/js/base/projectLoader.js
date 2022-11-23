loadPrButton.type = 'file';

loadPrButton.onchange = e => { 
   var file = e.target.files[0]; 
   var reader = new FileReader();
   reader.readAsText(file);
   
   reader.onload = function() {
   	console.log(reader.result);
   
	clearAllNodes();
	loadFromJson(reader.result);
   };
}
