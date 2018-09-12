// variables to change
var dataFolderId = "";
var reportingDate = "9-4";
var reportFolderId = "";
// boolean whether to require all periods. if false will ad zeroes
var requireAllPeriods = false;

function generateReport() {
  // finds the folder that contains report data
  var dataFolder = getDataFolderById(dataFolderId);
  // gets sheets that contain the reportingDate
  var dataSheetFiles = getSheetsByReportingDate(dataFolder, reportingDate);
  // creates a new Spreadsheet using the reportingDate in the name
  var reportId = createNewReport(reportingDate, reportFolderId);
  // opens the newly created report
  var reportSS = SpreadsheetApp.openById(reportId);
  // opens the data sheets files
  var dataSpreadsheets = openDataSheets(dataSheetFiles);
  // gets data from the spreadsheets
  var dataObject = getDataFromSpreadsheets(dataSpreadsheets);
  updateReportWithData(reportSS, dataObject.headers, dataObject.data);
  var store = dataObject.store;
  if(requireAllPeriods){
    checkStore(store);
  }else{
    fillStore(store);
  }
  mainReport(store);
  formatSheet();

}
