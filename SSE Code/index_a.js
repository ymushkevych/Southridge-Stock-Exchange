const stockCount = ; //how many stocks does your exchange track

function activateIndexA() {
  ScriptApp.newTrigger("setIndexA")
  .timeBased()
  .everyDays(1)
  .atHour(8)
  .create();
}

function setIndexA() {
  const index = SpreadsheetApp.openById('');
  const exchange = SpreadsheetApp.openById('');

  // define market day

  var marketDay = exchange.getSheetByName('Data & Statistics').getRange('G1').getValue();
  if (marketDay === 1) {
    var marketDayColumn = 10;
  } else if (marketDay > 1) {
    var marketDayColumn = 12 + ((marketDay - 2) * 5);
  }

  // set a value  based on how much the price of a stock changed
  // replace 40 with the number of stocks in your exchange
  var profitIncrease = exchange.getSheetByName('Data & Statistics').getRange(3, marketDayColumn, 40).getValues(); 
  for (var i = 0; i < stockCount; i++) {
    var val = profitIncrease[i][0];

    var result = 0;
    if (val > 185) {
      result = 1;
    } else if (val > 160) {
      result = 2;
    } else if (val > 125) {
      result = 3;
    } else if (val > 30) {
      result = 2;
    } else if (val > 0) {
      result = 1;
    } else if (val > -30) {
      result = 0.75;
    } else if (val > -125) {
      result = 0.5;
    } else if (val > -160) {
      result = 0.3
    } else if (val > -185) {
      result = 0.15;
    } else {
      result = 0;
    }

    index.getSheetByName('Index A').getRange(i + 2, 5).setValue(result);

  // calculate group bias as the proportion of total stock trades that a stock makes up, and output that value in column D.
  // replace 41 with the final row of the Index A sheet
  var biasIncrease = index.getSheetByName('Index A').getRange('B2:B41').getValues().flat().filter(String);  
  var dataList = exchange.getSheetByName('SSE Form Responses').getRange('C2:C').getValues().flat();
  for (var i = 0; i < stockCount; i++) {
    var currentItem = biasIncrease[i];

    var count = dataList.filter(function(value) {
      return value === currentItem;
    }).length;

    var finalGroupBias = (count/(exchange.getSheetByName('SSE Form Responses').getLastRow()-1))*10
    
    if(isNaN(finalGroupBias) === true) {
      var finalGroupBias = 0;
    }
    index.getSheetByName('Index A').getRange(i + 2, 4).setValue(finalGroupBias);
  
  }

  // sum all the values in a row, round up, and output them in column G
    for (var i = 0; i < stockCount; i++) {
      var biasValue = index.getSheetByName('Index A').getRange(i+2, 3).getValue();
      var groupBiasValue = index.getSheetByName('Index A').getRange(i+2, 4).getValue();
      var profitIncreaseValue = index.getSheetByName('Index A').getRange(i+2, 5).getValue();
      var reliabilityValue = index.getSheetByName('Index A').getRange(i+2, 6).getValue();

      var numberRating = biasValue + groupBiasValue + profitIncreaseValue + reliabilityValue;

      index.getSheetByName('Index A').getRange(i+2, 7).setValue(Math.ceil(numberRating));
    }

    // give each stock a letter rating (A, B, C, D) depending on the corresponding number rating. 
    for (var i = 0; i < stockCount; i++) {
      if (index.getSheetByName('Index A1').getRange(i+2, 7).getValue() >= 2 && index.getSheetByName('Index A').getRange(i+2, 7).getValue() <= 10) {
        index.getSheetByName('Index A').getRange(i+2, 8).setValue("D")
      } else if (index.getSheetByName('Index A').getRange(i+2, 7).getValue() >= 11 && index.getSheetByName('Index A').getRange(i+2, 7).getValue() <= 16) {
        index.getSheetByName('Index A').getRange(i+2, 8).setValue("C")
      } else if (index.getSheetByName('Index A').getRange(i+2, 7).getValue() >= 17 && index.getSheetByName('Index A').getRange(i+2, 7).getValue() <= 21) {
        index.getSheetByName('Index A').getRange(i+2, 8).setValue("B")
      } else if (index.getSheetByName('Index A').getRange(i+2, 7).getValue() >= 22) {
        index.getSheetByName('Index A').getRange(i+2, 8).setValue("A")
      }
    }  

}
