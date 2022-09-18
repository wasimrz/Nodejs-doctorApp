function DSUtil() {}

// convert array to map by pk
DSUtil.prototype.transformArrayToObjectByKey = function(arr, key) {
  const map = {};
  arr.forEach(x => map[x[key]]=x);
  
  return map;
}

DSUtil.prototype.removeUnknownCharacters = function (str) {
  if(!str) return '';

  return str.replace(/[^a-zA-Z_\/]/g, "");
}

module.exports = new DSUtil();