function listify(dataObject) {
  var dataList = [];
  var keys = Object.keys(dataObject);
  keys.forEach(function(key){
    var rowData = dataObject[key];
    var row = [];
    row.push(key);
    row.push(rowData["period1"]["spend"]);
    row.push(rowData["period2"]["spend"]);
    row.push(rowData["period1"]["revenue"]);
    row.push(rowData["period2"]["revenue"]);
    row.push(0);
    row.push(0);
    row.push(rowData["period3"]["spend"]);
    row.push(rowData["period4"]["spend"]);
    row.push(rowData["period3"]["revenue"]);
    row.push(rowData["period4"]["revenue"]);
    row.push(0);
    row.push(0);
    dataList.push(row);
  });
  return dataList
}
