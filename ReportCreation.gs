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


function placeData(data, space, color){
  //space refers to space above added data. defaults to one line of space
  var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
  SpreadsheetApp.setActiveSheet(reportSheet);
  var lastRow = reportSheet.getLastRow();
  if (typeof space === "undefined"){
    var startRow = lastRow + 2;
  } else if (typeof space === "number"){
    var startRow = lastRow + space + 1;
  } else if (!space){
    var startRow = lastRow + 1;
  }
  var dataSize = getDataSize(data);
  var dataRange = reportSheet.getRange(startRow,1,dataSize.rows, dataSize.columns);
  if (color){
    dataRange.setBackground(color)
  }
  dataRange.setValues(data);
  setRoasFormula(startRow, dataSize.rows);
  return startRow
}

function setRoasFormula(startRow, numRows){
  var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
  SpreadsheetApp.setActiveSheet(reportSheet);
  var roasColumns = [SS_ROAS_4W,SS_ROAS_2W,SS_ROAS_PM,SS_ROAS_LM];
  roasColumns.forEach(function(column){
    var currentRange = reportSheet.getRange(startRow, column, numRows);
    currentRange.setFormulaR1C1("=ROUND(DIVIDE(R[0]C[-2],R[0]C[-4]),2)");
    currentRange.setFontWeight("bold");
  });
}

function getColumnHeaders(title){
  var firstHeader = ["Spend","Revenue", "ROAS", "Spend", "Revenue", "ROAS"];
  var secondHeader = [title];
  var headers = {
    valueHeader: firstHeader,
    periodHeader: secondHeader
  }
  return headers
}

function placeHeader(header,columnNumber){
  var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
  SpreadsheetApp.setActiveSheet(reportSheet);
  var lastRow = reportSheet.getLastRow();

  var headerLength = header.length;
  var rangeLength = columnNumber - 1;
  var mergeValue = rangeLength/headerLength;
  // header is for spend revenue etc.
  if (header.length > 1){
    var currentColumn = 2;
    var headerCounter = 0;
    while(currentColumn <= columnNumber){
      var mergeRange = reportSheet.getRange(lastRow + 2, currentColumn, 1, mergeValue);
      mergeRange.mergeAcross();
      mergeRange.setValue(header[headerCounter]);
      mergeRange.setHorizontalAlignment("center");
      currentColumn += mergeValue;
      headerCounter++;
    }
  }
  //header is for time period
  else{
    var currentRow = lastRow + 1;
    var titleRange = reportSheet.getRange(currentRow, 1);
    titleRange.setValue(header[0]);
    var twoWeeks = [SS_SPEND_2W,SS_REVENUE_2W,SS_ROAS_2W];
    var fourWeeks = [SS_SPEND_4W,SS_REVENUE_4W,SS_ROAS_4W];
    var lastMonth = [SS_SPEND_LM,SS_REVENUE_LM,SS_ROAS_LM];
    var pMonth = [SS_SPEND_PM,SS_REVENUE_PM,SS_ROAS_PM];

    for (i=0; i<twoWeeks.length; i++){
      var range = reportSheet.getRange(currentRow, twoWeeks[i]);
      range.setFormula('=TEXT(TODAY()-14,"MM/d") & " - " & TEXT(TODAY()-1,"MM/D")');
      range.setHorizontalAlignment("center");
    }
    for (i=0; i<fourWeeks.length; i++){
      var range = reportSheet.getRange(currentRow, fourWeeks[i]);
      range.setFormula('=TEXT(TODAY()-28,"MM/d") & " - " & TEXT(TODAY()-15,"MM/D")');
      range.setHorizontalAlignment("center");
    }
    for (i=0; i<lastMonth.length; i++){
      var range = reportSheet.getRange(currentRow, lastMonth[i]);
      range.setFormula('=TEXT(TODAY()-30,"MM/d") & " - " & TEXT(TODAY()-1,"MM/D")');
      range.setHorizontalAlignment("center");
    }
    for (i=0; i<pMonth.length; i++){
      var range = reportSheet.getRange(currentRow, pMonth[i]);
      range.setFormula('=TEXT(TODAY()-60,"MM/d") & " - " & TEXT(TODAY()-31,"MM/D")');
      range.setHorizontalAlignment("center");
    }
  }
}

function setTotalsFormula(totalRow){
  // sets the forumula for cells that are totals
  var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
  SpreadsheetApp.setActiveSheet(reportSheet);
  var lastRow = reportSheet.getLastRow();
  // columns containing totals
  var totalColumns = [SS_SPEND_4W,SS_SPEND_2W,SS_REVENUE_4W,SS_REVENUE_2W,SS_SPEND_PM,SS_SPEND_LM,SS_REVENUE_PM,SS_REVENUE_LM];

  totalColumns.forEach(function(column){
    var currentRange = reportSheet.getRange(totalRow, column);
    var formula = "=SUM(R[1]C[0]:R[" + (lastRow-totalRow) + "]C[0])";
    currentRange.setFormulaR1C1(formula);
    currentRange.setFontWeight("bold");
  });
}

function addBorder(start, end, numberColumns){
  var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
  var range = reportSheet.getRange(start, 1, end - start + 1, numberColumns);
  range.setBorder(true, true, true, true, true, false, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}
