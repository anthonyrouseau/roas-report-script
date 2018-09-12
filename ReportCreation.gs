function mainReport(store) {

  const person1Color = "#c4fffc";
  const person2Color = "#d5ffa3";
  const person3Color = "#fcffba";

  var platform1BrandsHeaders = getColumnHeaders("Platform1 Brands");
  var platform2BrandsHeaders = getColumnHeaders("Platform2 Brands");
  var platform3BrandsHeaders = getColumnHeaders("Platform3 Brands");
  var platform1CampaignsHeaders = getColumnHeaders("Platform1 Campaigns");
  var platform2CampaignsHeaders = getColumnHeaders("Platform2 Campaigns");
  var platform3CampaignsHeaders = getColumnHeaders("Platform3 Campaigns");

  var storeKeys = Object.keys(store);
  var platformOrder = ["platform1", "platform2", "platform3"]; //platforms in order you want on sheet
  var people = ["person1", "person2", "person3"]; // list of strings corresponding to the campaign owners
  platformOrder.forEach(function(platform, index){
    if(storeKeys.indexOf(platform) == -1){
      platformOrder.splice(index, 1);
    }
  });
  platformOrder.forEach(function(platform){
    var platformDataObject = store[platform];
    Logger.log(platform);
    Logger.log(platformDataObject);
    var platformDataList = listify(platformDataObject);
    Logger.log("done");
    var platformTotal = ["Total",0,0,0,0,0,0,0,0,0,0,0,0];
    platformDataList.unshift(platformTotal);
    var campaignHeaders = null;
    var brandHeaders = null;
    var brandData = platformDataList;
    var columnNumber = platformTotal.length;
    switch(platform){
      case 'platform1':
        campaignHeaders = platform1CampaignsHeaders;
        brandHeaders = platform1BrandsHeaders;
        break;
      case 'platform2':
        campaignHeaders = platform2CampaignsHeaders;
        brandHeaders = platform2BrandsHeaders;
        break;
      case 'platform3':
        campaignHeaders = platform3CampaignsHeaders;
        brandHeaders = platform3BrandsHeaders;
        break;
    }
    if(brandHeaders){
      var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
      var beginRow = reportSheet.getLastRow() + 2;
      placeHeader(brandHeaders.valueHeader, columnNumber);
      placeHeader(brandHeaders.periodHeader, columnNumber);
      var brandTotalRow = placeData(brandData,false);
      setTotalsFormula(brandTotalRow);
      addBorder(beginRow, reportSheet.getLastRow(), columnNumber);
      beginRow = reportSheet.getLastRow() + 2;
      placeHeader(campaignHeaders.valueHeader, columnNumber);
      placeHeader(campaignHeaders.periodHeader, columnNumber);
      var totals = [["Total",0,0,0,0,0,0,0,0,0,0,0,0]];
      var totalStartRow = placeData(totals, false);
      people.forEach(function(person, index){
        var color = null;
        switch(person){
          case 'person1':
            color = person1Color;
            break;
          case 'person2':
            color = person2Color;
            break;
          case 'person3':
            color = person3Color;
            break;
        }
        var personDataObject = store[person][platform];
        if(personDataObject){
          var personDataList = listify(personDataObject);
          personDataList.sort(function(a, b) {
            var nameA = a[0].toUpperCase(); // ignore upper and lowercase
            var nameB = b[0].toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          });
          placeData(personDataList, false, color);
          setTotalsFormula(totalStartRow);
        }
      });
      addBorder(beginRow, reportSheet.getLastRow(), columnNumber);
    }else{
      var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
      var beginRow = reportSheet.getLastRow() + 2;
      placeHeader(campaignHeaders.valueHeader, columnNumber);
      placeHeader(campaignHeaders.periodHeader, columnNumber);
      var totals = [["Total",0,0,0,0,0,0,0,0,0,0,0,0]];
      var totalStartRow = placeData(totals, false);
      people.forEach(function(person, index){
        var color = null;
        switch(person){
          case 'person1':
            color = person1Color;
            break;
          case 'person2':
            color = person2Color;
            break;
          case 'person3':
            color = person3Color;
            break;
        }
        var personDataObject = store[person][platform];
        if(personDataObject){
          var personDataList = listify(personDataObject);
          personDataList.sort(function(a, b) {
            var nameA = a[0].toUpperCase(); // ignore upper and lowercase
            var nameB = b[0].toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          });
          placeData(personDataList, false, color);
          setTotalsFormula(totalStartRow);
        }
      });
      addBorder(beginRow, reportSheet.getLastRow(), columnNumber);
    }
  });
}
