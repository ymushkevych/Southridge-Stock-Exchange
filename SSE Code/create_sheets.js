function createSheets() {
  var ids = [];
  var emails = [];
  var passwords = [];
  var names = [];

  const responseSheet = SpreadsheetApp.openById().getSheetByName('Form Responses 1'); //link the google form used to collect responses into a sheet and copy-paste the ID

  const signupForm = FormApp.openById(); //signup form ID

  const responses = signupForm.getResponses();
  const formLength = responses.length;


  for (var i = 0; i < formLength; i++) {
    var templateSheet = DriveApp.getFileById(); // design an example portfolio
    var templateCopy = templateSheet.makeCopy("Individual Portfolio Sheet: " + responseSheet.getRange(i+2, 2).getValue());
    var portfolioSheet = SpreadsheetApp.open(templateCopy);
    var tab = portfolioSheet.getActiveSheet();
    tab.setName('portfolio');
    tab.getRange("A1").setValue(responseSheet.getRange(i+2, 2).getValue());
    tab.getRange("I2").setValue(responseSheet.getRange(i+2, 4).getValue());

    var driveFile = DriveApp.getFileById(portfolioSheet.getId());
    driveFile.addEditor(responseSheet.getRange(i+2, 3).getValue());

    var protection = tab.protect().setDescription("protected range");
    protection.addEditor(responseSheet.getRange(i+2, 3).getValue());
    var unprotected = tab.getRange('G5:G7');
    protection.setUnprotectedRanges([unprotected]);

    var id = portfolioSheet.getId();
    ids.push(id);

    // add password to main exchange sheet

    const exchange = SpreadsheetApp.openById();

    exchange.getSheetByName('Passwords').getRange(i+10, 2).setValue(responseSheet.getRange(i+2, 4).getValue());
    exchange.getSheetByName('Passwords').getRange(i+10, 1).setValue(responseSheet.getRange(i+2, 2).getValue());
  }

  console.log(names);
  console.log(emails);
  console.log(passwords);
  
}
