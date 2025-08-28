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
  const emailQ = "What is your email? (School email recommended)";
  const passwordQ = "What do you want your password to be?";

  var nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQ);
  var nameList = items[nameIndex];
  var name = target.getResponseForItem(nameList).getResponse();

  var emailIndex = items.findIndex(emailList => emailList.getTitle() === emailQ);
  var emailList = items[emailIndex];
  var email = target.getResponseForItem(emailList).getResponse();

  var passwordIndex = items.findIndex(passwordList => passwordList.getTitle() === passwordQ);
  var passwordList = items[passwordIndex];
  var password = target.getRepsonseForItem(passwordList).getResponse();


  names.push(name);
  emails.push(email);
  passwords.push(password);

  createSheets(names, emails, passwords);  
}

function createSheets(names, emails, passwords) {
  var ids = []; //do not edit

  for (var i = 0; i < emails; i++) {
    var templateSheet = DriveApp.getFileById(); //make an example portfolio sheet with the proper functions inserted and copy-paste the ID into this line. 
    var portfolioSheet = templateSheet.makeCopy("Individual Portfolio Sheet: " + names[i]);
    var tab = portfolioSheet.getActiveSheet();
    tab.getRange("A1").setValue(names[i]);
    tab.getRange("I2").setValue(passwords[i])
    var driveFile = DriveApp.getFileById(portfolioSheet.getId());
    driveFile.addEditor(emails[i]);

    var protection = tab.protect().setDescription("protected range");
    protection.addEditor(emails[i]);
    var unprotected = tab.getRange('G5:G7');
    protection.setUnprotectedRanges([unprotected]);

    var id = ss.getId();
    ids.push(id);
  }

  Console.log(ids);
  Console.log(passwords);
  Console.log(emails);
  Console.log(names);
}
