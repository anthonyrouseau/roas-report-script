// function to determine who runs the campaign
function assignMetaData(campaign,ownerData, startRow){
  var startRow = startRow || 2;
  var owner = null;
  var brand = null;
  var endRow = null;
  var campaignName = campaign[0];
  var campaignPlatform = campaign[PLATFORM_INDEX].toLowerCase();
  var lastRow = ownerData.length;
  var lastColumn = ownerData[0].length;
  var currentIndex = startRow - 1;
  var matched = false;
  while(currentIndex<lastRow && !matched){
    var rowData = ownerData[currentIndex];
    var campaignValue = rowData[0];
    var platformValue = rowData[1];
    var brandValue = rowData[2];
    var productValue = rowData[3];
    var ownerValue = rowData[4];
    if(campaignName.toLowerCase() == campaignValue.toLowerCase() && campaignPlatform == platformValue.toLowerCase()){
      matched = true;
      owner = ownerValue;
      brand = brandValue;
      endRow = currentIndex + 1;
    }
    currentIndex++;
  }
  if(!matched){
    endRow = startRow;
  }
  return {owner: owner, brand: brand, endRow: endRow}
}

function getOwnerData(){
  var campaignsUrl = ""; //sheet url that holds the campaign data
  var campaignsSS = SpreadsheetApp.openByUrl(campaignsUrl);
  SpreadsheetApp.setActiveSpreadsheet(campaignsSS);
  var campaignsMainSheet = campaignsSS.getSheetByName("Main");
  var dataRange = campaignsMainSheet.getDataRange();
  var values = dataRange.getValues();
  return values
}
