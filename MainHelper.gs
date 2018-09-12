function getDataFolderById(id) {
  // searches drive for folder with given name
  var dataFolder = DriveApp.getFolderById(id);
  // if the search results finds something returns the folder
  if (dataFolder) {
    return dataFolder;
  }
  // if nothing is found throws error that no folder was found
  else {
    throw new Error("No Data Folder Found");
  }
}


function getSheetsByReportingDate(folder, date) {
  var spreadsheetFiles = []
  // searches the files in the given folder for files with name containing the date
  var files = folder.searchFiles("title contains " + "'" + date +"'");
  // if the search returns values goes through each and pushes them to spreadSheetFiles array
  while (files.hasNext()){
    var file = files.next();
    spreadsheetFiles.push(file);
  }
  return spreadsheetFiles
}

function createNewReport(date, reportFolderId){
  var reportName = date + "_Report";
  var newReport = SpreadsheetApp.create(reportName);
  var parentFolder = DriveApp.getFolderById(reportFolderId);
  if(parentFolder){
    var file = DriveApp.getFileById(newReport.getId());
    parentFolder.addFile(file);
  }
  return newReport.getId();
}

function openDataSheets(files){
  var spreadsheets = [];
  files.forEach(function(file){
    var spreadsheet = SpreadsheetApp.open(file);
    spreadsheets.push(spreadsheet);
  });
  return spreadsheets
}

function getDataFromSpreadsheets(spreadsheets){
  // additional column headers for data, order matters
  var additionalHeaders = ["Platform","Period","Brand","Owner"];
  // variable to hold the column headers from the data sheets
  var columnHeaders = null;
  var data = [];
  spreadsheets.forEach(function(spreadsheet){
    SpreadsheetApp.setActiveSpreadsheet(spreadsheet);
    var sheet = spreadsheet.getSheets()[0];
    var range = sheet.getDataRange();
    var values = range.getValues();
    // if no column Headers have been set, will takes these from the first data sheets first row
    if (columnHeaders == null) {
      columnHeaders = values[0];
      // modify column headers with additional columns beyond what the data sheets contain
      columnHeaders = [columnHeaders.concat(additionalHeaders)]; //add metadata columns and make 2d array
    }
    values.shift(); //removes the header from each group of data
    // using the name of the data sheet to get info on platform, period etc.
    var spreadsheetName = spreadsheet.getName().toLowerCase();
    // splits the spreadsheet name by "_" and ".". data sheet names must be in this format
    var metaData = spreadsheetName.split(/[_.]/);
    metaData.shift(); //remove date, should be first thing in sheet name
    // if the last item in the array is csv for the file type remove it
    if (metaData[metaData.length - 1] == "csv"){
      metaData.pop();
    }
    // function to add the info from the data sheet name to the values in the data sheet
    addPlatformPeriod(values, metaData);
    // combines each data sheet into one sheet
    data = data.concat(values);
  });
  data.sort(campaignSort);
  var store = addOwnerBrand(data);
  return {store: store, data: data, headers: columnHeaders}
}

function updateReportWithData(report, headers, data){
  SpreadsheetApp.setActiveSpreadsheet(report);
  // name the first sheet in the report spreadsheet
  report.getSheets()[0].setName("Report");
  // creates another sheet for the raw data
  report.insertSheet("Raw Data",1);
  // places the raw data from the data sheets into the raw data sheet in the report
  var dataSize = getDataSize(data);
  var rawDataSheet = report.getSheetByName("Raw Data");
  // get range for all of data (from second row down to however long data is)
  var rawDataRange = rawDataSheet.getRange(2,1,dataSize.rows, dataSize.columns);
  // get range for headers (first row)
  var rawDataHeaderRange = rawDataSheet.getRange(1,1,1,headers[0].length);
  rawDataRange.setValues(data);
  rawDataHeaderRange.setValues(headers);
}

function getDataSize(data){
  // data is in form [[],[],[],...]
  // where each item in the array is a row and each item in the inner arrays are column values
  var dataRows = data.length;
  var dataColumns = data[0].length;
  return {columns: dataColumns, rows: dataRows}
}

function addPlatformPeriod(values, metaData){
  // takes each campaign value array and pushes the metaData from data sheet name into it
  values.forEach(function(campaign){
    metaData.forEach(function(datum){
      campaign.push(datum);
    });
  });
}

function addOwnerBrand(data){
  var store = {};
  var startRow = null;
  var ownerData = getOwnerData();
  data.forEach(function(campaign){
    var value = assignMetaData(campaign, ownerData, startRow);
    campaign.push(value.brand);
    campaign.push(value.owner);
    updateStore(campaign, store);
    startRow = value.endRow;
  });
  return store
}
