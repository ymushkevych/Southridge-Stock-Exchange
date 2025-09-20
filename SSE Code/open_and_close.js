function checkFormStatus() {
  // define basic variables
  
  const form =  FormApp.openById();
  // ↑ insert google forms ID
  const exchange = SpreadsheetApp.openById();
  // ↑ insert spreadsheet ID
  var marketState = exchange.getSheetByName('Data & Statistics').getRange('c1').getValue();

  var now = new Date();
  var isWeekday = now.getDay() >= 1 && now.getDay() <=5;
  var currentTime = now.getHours() * 60 + now.getMinutes();
  var openingTime = 8 * 60 + 25;
  var closingTime = 14 * 60 + 35;
  var isOpenTime = currentTime >= openingTime && currentTime <= closingTime;

  // if the time is within operating hours, set status to open, otherwise, closed
  var status = (isWeekday && isOpenTime) ? "OPEN" : "CLOSED";

  if (marketState === "OPEN") {
    form.setAcceptingResponses(true);
  } else if (marketState === "CLOSED") {
    form.setAcceptingResponses(false);
  } 
}
