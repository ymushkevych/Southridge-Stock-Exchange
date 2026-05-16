function activateTrigger() {
  ScriptApp.newTrigger("checkDevToolStatus")
  .timeBased()
  .everyDays(1)
  .atHour(8)
  .nearMinute(25)
  .create();
}

function checkDevToolStatus() {
  if (closeCell.getValue() === 'N' && isWeekday && dataStats.getRange('E20').getValue() == 0 && isMarketDown === false) {
    automateExchange();
  }
}

function automateExchange() {
  let recentMarketChange = dataStats.getRange('E5').getValue();
  let marketChangeEvaluation = Math.round(recentMarketChange/15);
  if (recentMarketChange >= 150) {
    marketChangeEvaluation = 10;
  } else if (recentMarketChange <= -150) {
    marketChangeEvaluation = -10;
  }

  for (let i = 0; i < stockCount; i++) {
    // bias

    let decay = 0.25;
    let biasEval = biases.getRange(i+2, 3).getValue();
    biases.getRange(i+2, 3).setValue(biasEval*decay);
    if (Math.abs(biases.getRange(i+2, 3).getValue()) <= 0.125) {
      biases.getRange(i+2, 3).setValue(0);
    }

    let localChange = dataStats.getRange(i+3, marketDayColumn+1).getValue();
    let localChangeEval = Math.round(10 * Math.sin(localChange * 0.155));
    if (localChange >= 30 || localChange <= -10) {
      localChangeEval = -10;
    }

    let dataList = formResponses.getRange('D2:D').getValues().flat();
    let currentItem = tickers[i];
    let count = dataList.filter(function(value) {
      return value === currentItem;
    }).length;
    
    let transactionPercentage = (count/responseCount) * 100;
    let diversityEval = Math.round(10 * Math.sin(0.05 * transactionPercentage));
    if (isNaN(diversityEval) === true) {
      diversityEval = 0;
    }

    let marketAverage = chartStats.getRange(43, marketDay+1).getValue();
    let averageEval = Math.round(100 * Math.log10(marketAverage/chartStats.getRange(i+2, marketDay+1).getValue()));

    let buyCounts = buySellCounts.getRange(i+2, 3).getValue();
    let sellCounts = buySellCounts.getRange(i+2, 2).getValue();
    let slope = 20/9.9;
    let intercept = - 1010/99;
    let transactionEvaluation = Math.round((slope * (buyCounts/sellCounts)) + intercept);
    if ((buyCounts / sellCounts) >= 10) {
      transactionEvaluation = 10;
    } else if ((buyCounts / sellCounts) <= 0.1) {
      transactionEvaluation = -10;
    }
    if (sellCounts === 0) {
      transactionEvaluation = -10;
    }
    let values = chartStats.getRange(2, marketDay+1, stockCount, 1).getValues().flat();
    let evalParameters = [localChangeEval, marketChangeEvaluation, transactionEvaluation, diversityEval, biasEval, averageEval]; 
    let totalEval = evalParameters.reduce((sum, currentItem) => sum + (Number.isNaN(evalParameters[values.indexOf(currentItem)]) === false && evalParameters[values.indexOf(currentItem)] !== null && evalParameters[values.indexOf(currentItem)] !== "" && evalParameters[values.indexOf(currentItem)] !== "#VALUE!" ? currentItem : 0), 0);

    ratingHist.getRange(i+2, marketDay-18).setValue(totalEval);
    let changeDir = Math.sign(totalEval);
    
    let changeCount = Math.round((100/Math.asin(1)) * Math.asin(totalEval/145)) + (Math.random() * 0.99);
    let previousValue = dataStats.getRange(i+3, marketDayColumn).getValue();
    let newValue = (dataStats.getRange(i+3, 10).getValue() < dataStats.getRange('D20').getValue()) ? 0 : previousValue + changeCount;

    let expectedCurve = 2500 * Math.sin((Math.PI/(50)) * marketDay+1);
    if ((newValue > expectedCurve) && (newValue !== 0) && (Math.random() <= 0.007)) {
      changeCount = -1 * Math.log(Math.abs(expectedCurve - newValue));
      newValue = previousValue + (changeCount);
    } else if ((newValue < expectedCurve) && (newValue !== 0) && (Math.random() <= 0.007)) {
      changeCount = 1 * Math.log(Math.abs(expectedCurve - newValue));
      newValue = previousValue + (changeCount);
    }

 
    // set the new values
    if (dataStats.getRange('g2').getValue() === "fall") {
      if (fallStocks.indexOf(i+2) !== -1 || miscStocks.indexOf(i+2) !== -1) {
        newValue = previousValue + (changeDir * (changeCount * Math.random() * (2-1.5) + 1.5));
      } else {
        newValue = previousValue + (changeDir * changeCount);
      }
    } else if (dataStats.getRange('g2').getValue() === "winter") {
      if (winterStocks.indexOf(i+2) !== -1 || miscStocks.indexOf(i+2) !== -1) {
        newValue = previousValue + (changeDir * (changeCount * Math.random() * (2-1.5) + 1.5));
      } else {
        newValue = previousValue + (changeDir * changeCount);
      }
    } else if (dataStats.getRange('g2').getValue() === "spring") {
      if (springStocks.indexOf(i+2) !== -1 || miscStocks.indexOf(i+2) !== -1) {
        newValue = previousValue + (changeDir * (changeCount * Math.random() * (2-1.5) + 1.5));
      } else {
        newValue = previousValue + (changeDir * changeCount);
      }  
    }
    dataStats.getRange(i+3, marketDayColumn+5).setValue(newValue);
    let doStockSplits = ((diversityEval < 5) && (newValue >= 2500) && ((Math.random() * 99 + 1) <= 5)) ? true : false

    if (doStockSplits == true) {
      splitRatio = 3;
      dataStats.getRange(i+3, marketDayColumn+5).setValue(newValue / splitRatio);
      dataStats.getRange(i+3, 10).setValue(dataStats.getRange(i+3, 10).getValue() * splitRatio);
    }
  }
  dataStats.getRange(3, marketDayColumn+5, stockCount, 1).setNumberFormat('$0.00');
  updateMarketDay();
}

function updateMarketDay() {
  Logger.log("UMD");
  dataStats.getRange('E20').setValue('1');
  chartStats.getRange(1, marketDay+2).setValue("day " + (marketDay + 1));
  let shares = dataStats.getRange(3, 10, stockCount, 1).getValues().flat();

  for (let i = 0; i < stockCount; i++) {
    let value = dataStats.getRange(i+3, marketDayColumn+5).getValue();
    chartStats.getRange(i+2, marketDay+2).setValue("$" + value);
    dataStats.getRange(i+3, marketDayColumn+6).setValue(value - dataStats.getRange(i+3, marketDayColumn).getValue());
    dataStats.getRange(i+3, marketDayColumn+6).setNumberFormat('$0.00').setFontColor("white");
    dataStats.getRange(i+3, marketDayColumn+7).setValue((value / dataStats.getRange(i+3, marketDayColumn).getValue()) - 1);
    dataStats.getRange(i+3, marketDayColumn+7).setNumberFormat('0.00%').setFontColor("white");

    if (dataStats.getRange(i+3, marketDayColumn+6).getValue() < 0) {
      dataStats.getRange(i+3, marketDayColumn+6).setBackground('#ff0000');
    } else if (dataStats.getRange(i+3, marketDayColumn+6).getValue() === 0) {
      dataStats.getRange(i+3, marketDayColumn+6).setBackground('#cccccc');
    } else if (dataStats.getRange(i+3, marketDayColumn+6).getValue() > 0) {
      dataStats.getRange(i+3, marketDayColumn+6).setBackground('#188038');
    }

    if (dataStats.getRange(i+3, marketDayColumn+7).getValue() < 0) {
      dataStats.getRange(i+3, marketDayColumn+7).setBackground('#ff0000');
    } else if (dataStats.getRange(i+3, marketDayColumn+7).getValue() === 0) {
      dataStats.getRange(i+3, marketDayColumn+7).setBackground('#cccccc');
    } else if (dataStats.getRange(i+3, marketDayColumn+7).getValue() > 0) {
      dataStats.getRange(i+3, marketDayColumn+7).setBackground('#188038');
    }

    // increase shares 
    let taxMoney = buySellCounts.getRange(i+2, 6).getValue();
    if (taxMoney > 0 && taxMoney > chartStats.getRange(i+2, marketDay+1).getValue()) {
      let additionalShares = Math.floor(buySellCounts.getRange(i+2, 6).getValue()/chartStats.getRange(i+2, marketDay+1).getValue());
      let newShareCount = Number(shares[i]) + Number(additionalShares);
      dataStats.getRange(i+3, 10).setValue(newShareCount);
      buySellCounts.getRange(i+2, 6).setValue(taxMoney - (additionalShares * chartStats.getRange(i+2, marketDay+1).getValue()));
    }
  }

  let changes = dataStats.getRange(3, marketDayColumn+7, stockCount, 1).getValues().flat();
  let changes_ordered = [...new Set(changes.filter(v => v !== "" && v !== null))];
  changes_ordered.sort((a,b) => b-a);
  let values = chartStats.getRange(2, marketDay+2, stockCount, 1).getValues().flat();
  let prices_ordered = [...new Set(values.filter(v => v !== "" && v !== null))];
  prices_ordered.sort((a,b) => b-a);
  for (let i = 0; i < stockCount; i++) {
    let price_rank = prices_ordered.indexOf(values[i]);
    dataStats.getRange(i+3, marketDayColumn+8).setValue(Number(price_rank+1));
    let change_rank = changes_ordered.indexOf(changes[i]);
    dataStats.getRange(i+3, marketDayColumn+9).setValue(Number(change_rank+1));
  }

  let rule = SpreadsheetApp.newConditionalFormatRule()
    .setGradientMinpointWithValue('#57bb8a', SpreadsheetApp.InterpolationType.PERCENTILE, 0)
    .setGradientMidpointWithValue("#ffd666", SpreadsheetApp.InterpolationType.PERCENTILE, 50)
    .setGradientMaxpointWithValue('#e67c73', SpreadsheetApp.InterpolationType.PERCENTILE, 100)
    .setRanges([dataStats.getRange(3, marketDayColumn + 8, stockCount, 1), dataStats.getRange(3, marketDayColumn + 9, stockCount, 1)])
    .build();
  
  let rules = dataStats.getConditionalFormatRules();
  rules.push(rule);
  dataStats.setConditionalFormatRules(rules);

  let pValues = chartStats.getRange(2, marketDay+1, stockCount, 1).getValues().flat();
  let p_tmv = pValues.reduce((sum, currentItem) => sum + currentItem, 0);
  let tmv =  values.reduce((sum, currentItem) => sum + currentItem, 0);

  let totalCap = values.reduce((sum, currentItem) => sum + (currentItem * shares[values.indexOf(currentItem)]), 0) / 1000000;
  let totalAvg = values.reduce((sum, currentItem)=> sum + currentItem, 0) / values.length;
  let fallAvg = values.reduce((sum, currentItem) => sum + (fallStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem : 0), 0) / fallStocks.length;
  let fallCap = values.reduce((sum, currentItem) => sum + (fallStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem * shares[values.indexOf(currentItem)]: 0), 0) / 1000000;
  let winterAvg = values.reduce((sum, currentItem) => sum + (winterStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem : 0), 0) / winterStocks.length;
  let winterCap = values.reduce((sum, currentItem) => sum + (winterStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem * shares[values.indexOf(currentItem)]: 0), 0) / 1000000;
  let springAvg = values.reduce((sum, currentItem) => sum + (springStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem : 0), 0) / springStocks.length;
  let springCap = values.reduce((sum, currentItem) => sum + (springStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem * shares[values.indexOf(currentItem)]: 0), 0) / 1000000;
  let miscAvg = values.reduce((sum, currentItem) => sum + (miscStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem : 0), 0) / miscStocks.length;
  let miscCap = values.reduce((sum, currentItem) => sum + (miscStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem * shares[values.indexOf(currentItem)]: 0), 0) / 1000000;

  chartStats.getRange(stockCount+3, marketDay+2).setValue(totalAvg);
  chartStats.getRange(stockCount+4, marketDay+2).setValue(fallAvg);
  chartStats.getRange(stockCount+5, marketDay+2).setValue(winterAvg);
  chartStats.getRange(stockCount+6, marketDay+2).setValue(springAvg);
  chartStats.getRange(stockCount+7, marketDay+2).setValue(miscAvg);
  chartStats.getRange(stockCount+8, marketDay+2).setValue(totalCap);
  chartStats.getRange(stockCount+9, marketDay+2).setValue(fallCap);
  chartStats.getRange(stockCount+10, marketDay+2).setValue(winterCap);
  chartStats.getRange(stockCount+11, marketDay+2).setValue(springCap);
  chartStats.getRange(stockCount+12, marketDay+2).setValue(miscCap);
  dataStats.getRange('E3').setValue(tmv);
  dataStats.getRange('E4').setValue(tmv-6212.00);
  dataStats.getRange('E5').setValue(tmv-p_tmv);

  dataStats.getRange(2, marketDayColumn+6).setValue('change');
  dataStats.getRange(2, marketDayColumn+7).setValue('%change');
  dataStats.getRange(2, marketDayColumn+8).setValue('price rank');
  dataStats.getRange(2, marketDayColumn+9).setValue('change rank');
  const day = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  dataStats.getRange(1, marketDayColumn+5).setValue((month+1) + '/' + day + '/' + year + ' - day ' + (marketDay+1) + ' - ' + dataStats.getRange('g2').getValue());
  dataStats.getRange(1, marketDayColumn+5,1, 5).merge();
  dataStats.getRange(2, marketDayColumn+5).setValue('value');
  dataStats.getRange('G1').setValue(marketDay+1);
  chartStats.getRange(stockCount+13, marketDay+2).setValue(dataStats.getRange('E8').getValue() / 1000000);
  Logger.log("UIS");
  updateIndividualSheets();
}

function updateIndividualSheets() {
  Logger.log("UIV");
  // update individual sheets
  for (let i = 0; i < ids.length; i++) {
    let sheet = SpreadsheetApp.openById(ids[i]);
    let tax = 0;
    let netWorth = sheet.getSheetByName('portfolio').getRange('G1').getValue();
    let bankWorth = sheet.getSheetByName('portfolio').getRange('G2').getValue();  
    for (let j = 0; j < stockCount; j++) {

      let currentCount = sheet.getSheetByName('portfolio').getRange(j+2, 4).getValue() * splitRatio;
      let updatedValue = (chartStats.getRange(j+2, marketDay+1).getValue() * currentCount);
      let futuresTime = sheet.getSheetByName('data').getRange(j+2, 6).getValue();
      let futuresCount = sheet.getSheetByName('data').getRange(j+2, 5).getValue();
      if (futuresTime > 1) { 
        sheet.getSheetByName('data').getRange(j+2, 6).setValue(futuresTime-1);
      } else {
        sheet.getSheetByName('data').getRange(j+2, 6).setValue("");
        sheet.getSheetByName('data').getRange(j+2, 5).setValue(0);
        sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (futuresCount * updatedValue));
      }
      sheet.getSheetByName('portfolio').getRange(j+2, 4).setValue(currentCount);
      sheet.getSheetByName('portfolio').getRange(j+2, 3).setValue(updatedValue);
    }
    if (netWorth > 10000000) {
      tax = (1-0.66)
    } else if (netWorth <= 10000000 && netWorth > 5000000) {
      tax = (1-0.73);
    } else if (netWorth <= 5000000 && netWorth > 2500000) {
      tax = (1-0.77);
    } else if (netWorth <=2500000 && netWorth > 1500000) {
      tax = (1-0.82);
    } else if (netWorth <= 1500000 && netWorth > 850000) {
      tax = (1-0.86);
    } else if (netWorth <= 850000 && netWorth > 200000) {
      tax = (1-0.90);
    } else if (netWorth <= 200000 && netWorth > 50000) {
      tax = (1-0.93);
    } else if (netWorth <= 50000) {
      tax = (1-0.95);
    }

    sheet.getSheetByName('portfolio').getRange('I2').setValue(tax*100);
  }
}

