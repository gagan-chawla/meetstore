function doPost(request) {
  let startDate = request.parameter.start_date;
  let endDate = request.parameter.end_date;
  let ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('key'));
  let sheet = ss.getSheetByName('Sheet1');
  sheet.appendRow([startDate, endDate]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doGet(request) {
  return ContentService.createTextOutput("{}").setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function init() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('key', ss.getId());
}

