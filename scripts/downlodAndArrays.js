function download(name, text){
	let file = new Blob([text],{ type: "text/plain;charset=utf-8" })
	document.getElementById('download').href = URL.createObjectURL(file);
	document.getElementById('download').download = `${name}`;
	document.getElementById('download').click(); 
} 
function numbersOfElement(array, element){
  let outdata = new Array();
  let indata = new Array();
  outdata = [];
  indata = array;
  for (let k = 0, h = 0; k < indata.length; k++) {
    if (indata[k] == element) {
      outdata[h] = k;
      h++;
    }
  }
  return outdata;
}
function is_array_on(array, element){
  return numbers_of_element(array, element).length != 0;
}
