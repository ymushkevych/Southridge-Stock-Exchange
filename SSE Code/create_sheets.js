function trigger() {
  ScriptApp.newTrigger("createSheets")
  .forForm(signupForm)
  .onFormSubmit()
  .create();
}

function createSheets() {
  let signup = signupForm.getResponses()[signupForm.getResponses().length - 1];

  items = signupForm.getItems();

  nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQuest);
  nameList = items[nameIndex];
  name = signup.getResponseForItem(nameList).getResponse();

  passIndex = items.findIndex(passList => passList.getTitle() === passQuest);
  passList = items[passIndex];
  pass = signup.getResponseForItem(passList).getResponse();

  let email = signup.getRespondentEmail();

  let templateSheet = DriveApp.getFileById('1G1qc6qugGA_DiCfq-DLu4SV5IcD9uWsdXTLw4PDjMOo');
  let templateCopy = templateSheet.makeCopy("Individual Portfolio Sheet: " + signupSheet.getRange(i+2, 2).getValue());
  let portfolioSheet = SpreadsheetApp.open(templateCopy);
  let tab = portfolioSheet.getSheetByName('portfolio');
  tab.getRange("A1").setValue(name);
  tab.getRange("K2").setValue(pass);

  let driveFile = DriveApp.getFileById(portfolioSheet.getId());
  driveFile.addEditor(signupSheet.getRange(i+2, 3).getValue());

  let protection = tab.protect().setDescription("protected range");
  tab = portfolioSheet.getSheetByName('data');
  protection = tab.protect().setDescription("protected range");
  tab = portfolioSheet.getSheetByName('chart');
  protection = tab.protect().setDescription("protected range");


  let id = portfolioSheet.getId();
  ids.push(id); 
  emails.push(email);
  passwords.push(pass);
  names.push(name);

  investors += 1;

}
