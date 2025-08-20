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

  // the row for the market average (in this case, 43), is the number of stocks in the market (40 for the example) + 3
  var marketAverage = exchange.getSheetByName('Chart Statistics').getRange(43, marketDay + 1).getValue();

  //indexA evaluation
  // the '42' in 'H42' is the number of stocks in the market (40 for the example) + 2
  if (indexA.getSheetByName('Index A').getRange('H42').getValue() === 'A') {
    var indexAEval = 2;
  } else if (indexA.getSheetByName('Index A').getRange('H42').getValue() === 'B') {
    var indexAEval = 1;
  } else if (indexA.getSheetByName('Index A').getRange('H42').getValue() === 'C') {
    var indexAEval = 0;
  } else if (indexAEval.getSheetByName('Index A').getRange('H42').getValue() === 'D') {
    var indexAEval= -1;
  }

  //indexB evaluation
  // 49 from number of stocks + 9
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

    //change price based on bidding, mimics supply and demand equilibria.

    if (exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 4).getValue() > 0 && exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 4).getValue() != "") {
      var buyBid = exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 4).getValue();
    } else {
      var buyBid = exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() + (Math.random() * (15 - -60) + -60);
    }

    if (indexA.getSheetByName('Index A').getRange(i+2, 8).getValue() === "A") {
      if (buyBid > exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(buyBid + 70);
      } else if (buyBid <= exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() + 55);
      }
    } else if (indexA.getSheetByName('Index A').getRange(i+2, 8).getValue() === "B") {
      if (buyBid > exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(buyBid + 50);
      } else if (buyBid <= exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() + 30);
      }
    } else if (indexA.getSheetByName('Index A').getRange(i+2, 8).getValue() === "C") {
      if (buyBid > exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(buyBid + 33);
      } else if (buyBid <= exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() + 25);
      }
    } else if (indexA.getSheetByName('Index A').getRange(i+2, 8).getValue() === "D") {
      if (buyBid > exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(buyBid + 20);
      } else if (buyBid <= exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() + 12);
      }
    } 

    var sellBid = exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).getValue();

    var averagePrice = (sellBid+buyBid)/2;
    if (exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() > averagePrice) {
      var bidEval = -5;
    } else {
      var bidEval = 5;
    }

    exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 4).setValue(0);
    exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 5).setValue(0);


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

    // shares left evaluation
    // more shares in the market = less buying of shares = prices go down to attract potential buyers. 

    var sharesLeft = exchange.getSheetByName('Data & Statistics').getRange(i+3, 10).getValue();
    var expected = 10000 + (marketDay * 50)

    if (sharesLeft >= expected * 10) {
      var sharesLeftEval = -6;
    } else if (sharesLeft >= expected * 8) {
      var sharesLeftEval = -5;
    } else if (sharesLeft >= expected * 6) {
      var sharesLeftEval = -4;
    } else if (sharesLeft >= expected * 4) {
      var sharesLeftEval = -3;
    } else if (sharesLeft >= expected * 2) {
      var sharesLeftEval = -2;
    } else if (sharesLeft > expected) {
      var sharesLeftEval = -1;
    } else if (sharesLeft === expected) {
      var sharesLeftEval = -1;
    } else if (sharesLeft >= expected * 0.5) {
      var sharesLeftEval = 1;
    } else if (sharesLeft >= expected * 0.25) {
      var sharesLeftEval = 2;
    } else if (sharesLeft >= expected * 0.125) {
      var sharesLeftEval = 3;
    } else if (sharesLeft >= expected *0.06125) {
      var sharesLeftEval = 4;
    } else if (sharesLeft > 0) {
      var sharesLeftEval = 5;
    } else if (sharesLeft <= 0) {
      var sharesLeftEval = 6;
    }

    // diversity eval
    // the more investors have a share. i.e., the more diversity a share holds, the more likely it is to be stable, and so, prices rise.

    var diversityEval = 0;

    for (var k = 0; k < exchange.getSheetByName('Data & Statistics').getRange('D20').getValue(); k++) {
      if (exchange.getSheetByName('Stock Exchange').getRange(4 * (k+1), i+5).getValue != 0) {
        diversityEval += 1;
      } else {
        diversityEval += -0.3;
      }
    }

    // group bias eval
    // if a stock is being traded too often or not often enough, the price goes down
    // to my knowledge, this doesn't really reflect anything; it's mainly there to prevent investors from over-investing in one stock 

    var groupBias = indexA.getSheetByName('Index A').getRange(i+2, 4).getValue();

    if (groupBias >= 0.7) {
      var groupBiasEval = -3;
    } else if (groupBias < 0.7 && groupBias >= 0.25) {
      var groupBiasEval = 6;
    } else {
      var groupBiasEval = -6;
    }

    // average eval
    // if share price is below or equal to market average, increase price; otherwise, decrease price
    // This should create a pattern where the price of a share rises and then drops again, creating a pseudo market curve.

    if (exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() > marketAverage) {
      var averageEval = -6;
    } else if (exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() < marketAverage) {
      var averageEval = 6;
    } else if (exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() === marketAverage) {
      var averageEval = 4;
    }

    // bias evaluation
    // random increase or decrease in evaluation based on some pre-determined metric
    
    var bias = Math.floor((indexA.getSheetByName('Index A').getRange(i+2, 3).getValue()+indexA.getSheetByName('Index A').getRange(i+2, 6).getValue()) /2);
    if (bias === 1) {
      var randomEval = Math.round(Math.random() * (-8 - -10) + -10);
    } else if (bias === 2) {
      var randomEval = Math.round(Math.random() * (-6 - -8) + -8);
    } else if (bias === 3) {
      var randomEval = Math.round(Math.random() * (-4 - -6) + -6);
    } else if (bias === 4) {
      var randomEval = Math.round(Math.random() * (-2 - -4) + -4);
    } else if (bias === 5) {
      var randomEval = Math.round(Math.random() * (0 - -2) + -2);
    } else if (bias === 6) {
      var randomEval = Math.round(Math.random() * (2 - 0) + 2);
    } else if (bias === 7) {
      var randomEval = Math.round(Math.random() * (4 - 2) + 2);
    } else if (bias === 8) {
      var randomEval = Math.round(Math.random() * (6 - 4) + 4);
    } else if (bias === 9) {
      var randomEval = Math.round(Math.random() * (8 - 6) + 6);
    }  else if (bias === 10) {
      var randomEval = Math.round(Math.random() * (10 - 8) + 8); 
    }

    // buy and sell evals.
    // if buy > sell, price goes up. if sell > buy, price goes down

    var buyCounts = exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 3).getValue();
    var sellCounts = exchange.getSheetByName('Buy & Sell Counts').getRange(i+2, 2).getValue();
    
    if ((buyCounts > sellCounts) && sellCounts > 0) {
      if (buyCounts / sellCounts >= 6) {
        var transactionEvaluation = 4;
      } else if (buyCounts / sellCounts >= 4) {
        var transactionEvaluation = 3;
      } else if (buyCounts / sellCounts >= 2) {
        var transactionEvaluation = 2;
      } else if (buyCounts / sellCounts >= 1) {
        var transactionEvaluation = 1;
      }

    } else if ((buyCounts < sellCounts) &&  buyCounts > 0) {
      if (sellCounts / buyCounts >= 6) {
         var transactionEvaluation = -4;
      } else if (sellCounts / buyCounts >= 4) {
        var transactionEvaluation = -3;
      } else if (sellCounts / buyCounts >= 2) {
        var transactionEvaluation = -2;
      } else if (sellCounts / buyCounts >= 1) {
        var transactionEvaluation = -1;
      }
    } else if ((buyCounts > sellCounts) && sellCounts === 0) {
      var transactionEvaluation = 2;
    } else if ((buyCounts < sellCounts) && buyCounts === 0) {
      var transactionEvaluation = -2;
    } else if (buyCounts === sellCounts) {
      var transactionEvaluation = -1;
    }

    // calculate total and final evals

    var totalEval = percentChangeEval + marketChangeEvaluation + indexBEval + indexAEval + bidEval + sharesLeftEval + randomEval + transactionEvaluation + groupBiasEval + diversityEval;
    var finalEval = Math.abs(Math.round(totalEval));

    // calculate the new value of the share based on evaluations

    exchange.getSheetByName('Rating History').getRange(i+2, marketDay-18).setValue(totalEval);

    if (totalEval > 0) {
      var changeDir = 1;
    } else {
      var changeDir = -1;
    }

    if (finalEval >= 60) {
      if (Math.round(Math.random() * (100 - 1) - 1) <= 99) {
        var changeCount = Math.round(Math.random() * (150 - 0) + 0) + Math.random();
      } else if (Math.round(Math.random() * (100 - 1) - 1) === 100) {
        var changeCount = -45 - Math.random();
      }
    } else if (finalEval >= 50) {
      if (Math.round(Math.random() * (100 - 1) - 1) <= 97) {
        var changeCount = Math.round(Math.random() * (107 - 0) + 0) + Math.random();
      } else if (Math.round(Math.random() * (100 - 1) - 1) === 98) {
        var changeCount = -28 - Math.random();
      }
    } else if (finalEval >= 40) {
      if (Math.round(Math.random() * (100 - 1) - 1) <= 70) {
        var changeCount = Math.round(Math.random() * (80 - 0) + 0) + Math.random();
      } else if (Math.round(Math.random() * (100 - 1) - 1) >= 71) {
        var changeCount = -21 - Math.random();
      }
    } else if (finalEval >= 30) {
      if (Math.round(Math.random() * (100 - 1) - 1) <= 51) {
        var changeCount = Math.round(Math.random() * (58 - 0) + 0) + Math.random();
      } else if (Math.round(Math.random() * (100 - 1) - 1) >= 52) {
        var changeCount = -15 - Math.random();
      }
    } else if (finalEval >= 20) {
      if (Math.round(Math.random() * (100 - 1) - 1) <= 35) {
        var changeCount = Math.round(Math.random() * (37 - 0) + 0) + Math.random();
      } else if (Math.round(Math.random() * (100 - 1) - 1) >= 36) {
        var changeCount = -10 - Math.random();
      }
    } else if (finalEval >= 10) {
      if (Math.round(Math.random() * (100 - 1) - 1) <= 21) {
        var changeCount = Math.round(Math.random() * (18 - 0) + 0) + Math.random();
      } else if (Math.round(Math.random() * (100 - 1) - 1) >= 22 ) {
        var changeCount = -5 - Math.random();
      }
    } else if (finalEval >= 1) {
      if (Math.round(Math.random() * (100 - 1) - 1) <= 7) {
        var changeCount = Math.round(Math.random() * (2 - 0) + 0) + Math.random();
      } else if (Math.round(Math.random() * (100 - 1) - 1) >= 8 ) {
        var changeCount = -1 - Math.random();
      }
    }  

    var previousValue = exchange.getSheetByName('Data & Statistics').getRange(i+3, marketDayColumn).getValue();

    if (exchange.getSheetByName('Data & Statistics').getRange('g2').getValue() === "fall") {
      if (fallStocks.indexOf(i+2) !== -1 || yearStocks.indexOf(i+2) !== -1) {
        var newValue = previousValue + (changeDir * changeCount);
      } else {
        var newValue = previousValue + (changeDir * (changeCount / (Math.random() * (4-3) + 3)));
      }
    } else if (exchange.getSheetByName('Data & Statistics').getRange('g2').getValue() === "winter") {
      if (winterStocks.indexOf(i+2) !== -1 || yearStocks.indexOf(i+2) !== -1) {
        var newValue = previousValue + (changeDir * changeCount);
      } else {
        var newValue = previousValue + (changeDir * (changeCount / (Math.random() * (4-3) + 3)))
      }
    } else if (exchange.getSheetByName('Data & Statistics').getRange('g2').getValue() === "spring") {
      if (springStocks.indexOf(i+2) !== -1 || yearStocks.indexOf(i+2) !== -1) {
      var newValue = previousValue + (changeDir * changeCount);
      } else {
        var newValue = previousValue + (changeDir * (changeCount / (Math.random() * (4-3) + 3)))
      }  
   
    }
    if (newValue < 0.01) {
      var newValue = 1 + (Math.random() * (5 - 0) + 0) + Math.random();
    }
    
  }
  
}
