let names = [];
let emails = [];
let passwords = [];

function setup() {

  var signupForm = FormApp.openById();
  
  ScriptApp.newTrigger("configureNamesAndEmails")
  .forForm(signupForm)
  .onFormResponse()
  .create();
}

function configureNamesAndEmails() {

  var signupForm = FormApp.openById();

  const responses = form.getResponses();
  const formLength = responses.length;
  const target = responses[formLength - 1];
  const items = form.getItems();

  const nameQ = "What is your name (First and Last)";
  const emailQ = "What is your email?";
  const passwordQ = "What do you want your password to be?";

  var nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQ);
  var nameList = items[nameIndex];
  var name = target.getResponseForItem(nameList).getResponse();

  var emailIndex = items.findIndex(emailList => emailList.getTitle() === emailQ);
  var emailList = items[emailIndex];
  var email = target.getResponseForItem(emailList).getResponse();

  var passwordIndex = items.findIndex(passwordList => passwordList.getTitle() === passwordQ);
  var passwordList = items[passwordIndex];
  var password = target.getResponseForItem(passwordList).getResponse();


  names.push(name);
  emails.push(email);
  passwords.push(password);

  createSheets(names, emails, passwords);  
}

function createSheets(names, emails, passwords) {
  var ids = []; //do not edit

  for (var i = 0; i < emails.length; i++) {
    var templateSheet = DriveApp.getFileById();
    var templateCopy = templateSheet.makeCopy("Individual Portfolio Sheet: " + names[i]);
    var portfolioSheet = SpreadsheetApp.open(templateCopy);
    var tab = portfolioSheet.getActiveSheet();
    tab.setName('portfolio');
    tab.getRange("A1").setValue(names[i]);
    tab.getRange("I2").setValue(passwords[i])
    
    var driveFile = DriveApp.getFileById(portfolioSheet.getId());
    driveFile.addEditor(emails[i]);

    var protection = tab.protect().setDescription("protected range");
    protection.addEditor(emails[i]);
    var unprotected = tab.getRange('G5:G7');
    protection.setUnprotectedRanges([unprotected]);

    var id = portfolioSheet.getId();

    ids.push(id);
  }

  console.log(ids);
  console.log(passwords);
  console.log(emails);
  console.log(names);

  // copy-paste the lists that appear (you can view them in Executions → configureNamesAndEmails. If you already have other scripts running, you can use ctrl+f or find-in-page to help
}
