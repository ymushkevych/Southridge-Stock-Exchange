function activateTrigger() {
  // run this function once to set up the trigger. 
  //The associated function will run once, every day, at around 8:35 AM

  ScriptApp.newTrigger("checkStatus")
  .timeBased()
  .everyDays(1)
  .atHour(8)
  .nearMinute(35)
  .create();
}

function checkStatus() {
  var now = new Date();
  var isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
  const exchange = SpreadsheetApp.openById();
  
  if (isWeekday) {
    automateExchange();
  }
}

function automateExchange() {
  const exchange = SpreadsheetApp.openById();
  const indexA = SpreadsheetApp.openById();

  // insert the row number of the stock as it appears on the 'Chart Statistics' sheet
  var fallStocks = [];
  var winterStocks = [];
  var springStocks = [];
  var winterStocks = [];
  
  var marketDay = exchange.getSheetByName('Data & Statistics').getRange('G1').getValue();
  var marketDayColumn = 12 + ((marketDay - 2) * 5);

  var recentMarketChange = exchange.getSheetByName('Data & Statistics').getRange('E5').getValue();
  var marketAverage = exchange.getSheetByName('Chart Statistics').getRange(43, marketDay + 1).getValue();

  //indexA evaluation
  if (indexA.getSheetByName('Index A').getRange('H42').getValue() === 'A') {
    var indexAEval = 2;
  } else if (indexA.getSheetByName('Thurman Rating 1.1').getRange('H42').getValue() === 'B') {
    var indexAEval = 1;
  } else if (indexA.getSheetByName('Thurman Rating 1.1').getRange('H42').getValue() === 'C') {
    var indexAEval = 0;
  } else if (indexAEval.getSheetByName('Thurman Rating 1.1').getRange('H42').getValue() === 'D') {
    var indexAEval= -1;
  }

  //indexB evaluation
  var indexBStatistic = exchange.getSheetByName('Chart Statistics').getRange(49, marketDay + 1).getValue();
  if ((indexBStatistic / marketAverage) >= 3) {
    var indexBEval = 2;
  } else if ((indexBStatistic / marketAverage) >= 2) {
    var indexBEval = 1;
  } else if ((indexBStatistic / marketAverage) >= 1) {
    var indexBEval = 0;
  }   
  
  //market change Evaluation
  if (recentMarketChange > 0) {
    var marketChangeEvaluation = 3;
  } else if (recentMarketChange < 0) {
    var marketChangeEvaluation = -3;
  } else if (recentMarketChange === 0) {
    var marketChangeEvaluation = -2;
  }

  for (var i = 0; i < 40; i++) {
    // ↑ 40 can be changed to whatever the stock count is on your version of the market

    //Growth Evaluation

    var percentChangeTotal = (exchange.getSheetByName('Data & Statistics').getRange(i+3, marketDayColumn + 2).getValue()) + (exchange.getSheetByName('Data & Statistics').getRange(i+3, marketDayColumn - 3).getValue());
    if (percentChangeTotal*10 >= 8) {
      var percentChangeEval = 10;
    } else if(percentChangeTotal*10 >= 6) {
      var percentChangeEval = 8;
    } else if (percentChangeTotal*10 >= 4) {
      var percentChangeEval = 6;
    } else if (percentChangeTotal*10 >= 2) {
      var percentChangeEval = 4;
    } else if (percentChangeTotal*10 > 0) {
      var percentChangeEval = 2;
    } else if (percentChangeTotal*10 === 0) {
      var percentChangeEval = 0;
    } else if (percentChangeTotal*10 >= -2) {
      var percentChangeEval = -2;
    } else if (percentChangeTotal*10 >= -4) {
      var percentChangeEval = -4;
    } else if (percentChangeTotal*10 >= -6) {
      var percentChangeEval = -6;
    } else if (percentChangeTotal*10 >= -8) {
      var percentChangeEval = -8;
    } else if (percentChangeTotal*10 < -8) {
      var percentChangeEval = -10;
    }

    var totalEval = percentChangeEval + marketChangeEvaluation + indexBEval + indexAEval;
    var finalEval = Math.abs(Math.round(totalEval));

    
  }
  
}
