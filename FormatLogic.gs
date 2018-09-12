function formatSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
  freezeColumnOne(sheet);
  setColumnDataTypes(sheet);
  resizeColumns(sheet);
}

function resizeColumns(sheet){
  // resize the columns to size of data
  var lastColumn = sheet.getDataRange().getLastColumn();
  var currentColumn = 1;
  while(currentColumn<= lastColumn){
    sheet.autoResizeColumn(currentColumn)
    currentColumn++
  }
}

function freezeColumnOne(sheet){
  // freezes the first column with names of campaign
  sheet.setFrozenColumns(1);
}

function setColumnDataTypes(sheet){
  // sets the data types for the columns containing dollar amounts and percents
  var lastRow = sheet.getLastRow();
  // ranges where dollar amounts are needed (will change if order of columns changes)
  var moneyRanges = [sheet.getRange(1,2,lastRow,4),sheet.getRange(1, 8, lastRow, 4)];
  // ranges where percents are needed (will change if order of columns changes)
  var percentageRanges = [sheet.getRange(1,6,lastRow,2), sheet.getRange(1,12,lastRow,2)];
  // goes through each range that need dollar amounts and sets format
  moneyRanges.forEach(function(range){
    range.setNumberFormat("$#,##0");
  });
  // set percent formats for each range
  percentageRanges.forEach(function(range){
    range.setNumberFormat("0%");
    addGradient(range);
  });
}

function addGradient(range){
  // creates a heat map for roas ranges but does not update if the values are changed afterwards
  var values = range.getValues();
  var rangeStartColumn = range.getColumn();
  values.forEach(function(rowArray, rowIndex){
    var currentRow = rowIndex + 1;
    rowArray.forEach(function(roas, columnIndex){
      var currentColumn = rangeStartColumn + columnIndex;
      if (typeof roas == "number"){
        var r = 190;
        var g = 0;
        var b = 0;
        if(roas <= 0){
        // default values
        }else if(roas <= .75){
          g = roas/(0.01) * (38/15);
        } else if(roas <= 1.2){
          r = 190 - (roas - 0.75)/.01 * (38/9);
          g = 190;
        } else if (roas <= 1.5){
          g = 190 - (roas - 1.2)/.01 * (5/3);
          r = 0;
        }else{
        // cap color
          g = 140;
          r = 0;
        }
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report");
        var cell = sheet.getRange(currentRow, currentColumn);
        cell.setBackgroundRGB(r,g,b);
      }
    });
  });
}
