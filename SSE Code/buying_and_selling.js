const nameQuest = "What's your name?";
const passQuest = "What is your SSE password";
const typeQuest = "What action would you like to perform today?";
const stockQuest = "What stock do you want to exchange";
const sellQuest = "How much of that stock do you wish to SELL?";
const giftQuest = "What stock do you want to gift";
const amountQuest = "How much are you willing to gift?";
const recipientQuest = "Who are you gifting to?";
const futuresQuest = "What stock do you want to buy futures in?";
const buyQuest = "How much of that stock do you wish to BUY?";
const groupQuest = "Which stock group are you investing in?";
const investmentQuest = "How much money are you investing?";

/**
 * Step 1: Determine if the name and password match. This prevents the market from doing lengthy computations if the end result is invalid
 * Step 2: Determine what action the investor wants to perform. 
 * 
 * If buying & selling:
 * - what stock is being exchanged
 * - how much is being sold (or bought)
 * - If sell > count = 0:
 * - - Cancel transaction
 * - If buy > count:
 * - - buy = count
 * 
 * If gifting shares:
 * - What stock is being gifted
 * - How much is being gifted
 * - Who is the recipient
 * 
 * If buying futures:
 * - What stock is being bought
 * - How much is being bought
 * 
 * If investing in a group:
 * - What group is being invested in
 * - How much money is being put into the investment
 */

function transactionType() {
  let nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQuest);
  let nameList = items[nameIndex];
  let name = target.getResponseForItem(nameList).getResponse();

  let passIndex = items.findIndex(passList => passList.getTitle() === passQuest);
  let passList = items[passIndex];
  let pass = target.getResponseForItem(passList).getResponse();

  let typeIndex = items.findIndex(typeList => typeList.getTitle() === typeQuest);
  let typeList = items[typeIndex];
  let type = target.getResponseForItem(typeList).getResponse();

  let action = actions.indexOf(type) + 1;
  if (pass !== passwords[names.indexOf(name)]) {
    action = 0;
  } 
    if (action == 1) {
      buyAndSell();
    } else if (action == 2) {
      giftShares();
    } else if (action == 3) {
      buyFutures();
    } else if (action == 4) {
      groupInvestment();
    }
}

function buyAndSell() {
  let typeIndex = items.findIndex(typeList => typeList.getTitle() === typeQuest);
  let typeList = items[typeIndex];
  let type = target.getResponseForItem(typeList).getResponse();

  let nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQuest);
  let nameList = items[nameIndex];
  let name = target.getResponseForItem(nameList).getResponse();

  let passIndex = items.findIndex(passList => passList.getTitle() === passQuest);
  let passList = items[passIndex];
  let pass = target.getResponseForItem(passList).getResponse();

  let stockIndex = items.findIndex(stockList => stockList.getTitle() === stockQuest);
  let stockList = items[stockIndex];
  let stock = target.getResponseForItem(stockList).getResponse();

  let sellIndex = items.findIndex(sellList => sellList.getTitle() === sellQuest);
  let sellList = items[sellIndex];
  let sell = Math.round(target.getResponseForItem(sellList).getResponse());

  let sheet = SpreadsheetApp.openById(ids[names.indexOf(name)]);
  let debtLimit = debtLimits[names.indexOf(name)];
  let row = tickers.indexOf(stock);
  let currentCount = sheet.getSheetByName('portfolio').getRange(row + 2, 4).getValue();
  let sharePrice = chartStats.getRange(row + 2, marketDay+1).getValue();
  let range = Math.random() * (sharePrice * 1.1 - sharePrice * 0.9) + (sharePrice * 0.9);
  let netWorth = sheet.getSheetByName('portfolio').getRange('G1').getValue();
  let bankWorth = sheet.getSheetByName('portfolio').getRange('G2').getValue();

  if (sell > currentCount) {
    sell = currentCount;
  } else if (sell < 0 && (bankWorth - ((Math.abs(sell) * range)) <= debtLimit)) {
    sell = Math.floor((debtLimit - bankWorth)/range); 
  } else if (sell < 0 && bankWorth <= debtLimit) {
    return 0;
  }

  if (sell > 0) {
    if (netWorth < 0) {
      return 0;
    }
  } else if (sell < 0) {
    if (netWorth < 0 || bankWorth < debtLimit) {
      return 0;
    }
  } else {
    return 0
  }

  let tax = 0;
    if (netWorth > 10000000) {
      tax = (1-0.67);
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

  sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth - ((range * sell) * (sell > 0 ? tax : 1)));
  sheet.getSheetByName('portfolio').getRange(row+2, 4).setValue(currentCount -  sell);
  sheet.getSheetByName('portfolio').getRange(row+2, 3).setValue(sheet.getSheetByName('portfolio').getRange(row+2, 4).getValue() * sharePrice);
  let currentTaxedMoney = buySellCounts.getRange(row+2, 6).getValue();
  if (sell > 0) {
    buySellCounts.getRange(row+2, 6).setValue(currentTaxedMoney + (tax * (sell * range)));
  }
  sheet.getSheetByName('portfolio').getRange('I2').setValue(tax*100);

  let moneyNeeded = sell * range
  if (sell < 0) {
    if (marketMoney >= (moneyNeeded)) {
      dataStats.getRange('E6').setValue(marketMoney - (moneyNeeded));
    } else {
      moneyNeeded = marketMoney - (moneyNeeded);
      dataStats.getRange('E6').setValue(0);
      for (let i = 0; i < stockCount; i++) {
        currentTaxedMoney = buySellCounts.getRange(i+2, 6).getValue();
        if (currentTaxedMoney >= moneyNeeded) {
          buySellCounts.getRange(i+2, 6).setValue(currentTaxedMoney - moneyNeeded);
          break;
        } else {
          moneyNeeded = currentTaxedMoney - moneyNeeded;
          buySellCounts.getRange(i+2, 6).setValue(0);
        }
      }
    }
  }

  if (moneyNeeded > 0) {
    // code for converting public shares into money
  }
  

  formResponses.getRange(responseCount+1, 2).setValue(name);
  formResponses.getRange(responseCount+1, 3).setValue(pass);
  formResponses.getRange(responseCount+1, 4).setValue(type);
  formResponses.getRange(responseCount+1, 5).setValue(stock);
  formResponses.getRange(responseCount+1, 6).setValue(sell);

  sheet.getSheetByName('data').getRange(row+2, (sell > 0 ? 4 : 3)).setValue(marketDay);
  let currentBuySellCount = buySellCounts.getRange(row+2, (sell > 0 ? 2 : 3)).getValue();
  buySellCounts.getRange(row+2, (sell > 0 ? 2 : 3)).setValue(currentBuySellCount + Math.abs(sell));
}

function buyFutures() {
  let typeIndex = items.findIndex(typeList => typeList.getTitle() === typeQuest);
  let typeList = items[typeIndex];
  let type = target.getResponseForItem(typeList).getResponse();

  let nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQuest);
  let nameList = items[nameIndex];
  let name = target.getResponseForItem(nameList).getResponse();

  let passIndex = items.findIndex(passList => passList.getTitle() === passQuest);
  let passList = items[passIndex];
  let pass = target.getResponseForItem(passList).getResponse();

  let futuresIndex = items.findIndex(futuresList => futuresList.getTitle() === futuresQuest);
  let futuresList = items[futuresIndex];
  let futures = target.getResponseForItem(futuresList).getResponse();

  let buyIndex = items.findIndex(buyList => buyList.getTitle() === buyQuest);
  let buyList = items[buyIndex];
  let buy = target.getResponseForItem(buyList).getResponse();


  let sheet = SpreadsheetApp.openById(ids[names.indexOf(name)]);
  let debtLimit = debtLimits[names.indexOf(name)];
  let netWorth = sheet.getSheetByName('portfolio').getRange('G1').getValue();
  let bankWorth = sheet.getSheetByName('portfolio').getRange('G2').getValue();
  let row = tickers.indexOf(futures);

  if (sheet.getSheetByName('data').getRange(row+2, 6).getValue() > 0) {
    return 0;
  } else if (netWorth < 0 || bankWorth < debtLimit) {
    return 0;
  }
  let sharePrice = chartStats.getRange(row + 2, marketDay+1).getValue();
  let r = 0;
  for (let i = 0; i < 5; i++) {
    r += dataStats.getRange(row+3, (marketDayColumn+2)-(5*i)).getValue();
  }
  r /= (5 * sharePrice);
  let futuresPrice = sharePrice * ((1+r)^(20));

  if ((bankWorth - ((buy * futuresPrice)) <= debtLimit)) {
    buy = Math.floor((debtLimit - bankWorth)/futuresPrice); 
  }


  sheet.getSheetByName('data').getRange(row+2, 5).setValue(buy);
  sheet.getSheetByName('data').getRange(row+2, 6).setValue(20);
  sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth - (buy * futuresPrice));

  formResponses.getRange(responseCount+1, 2).setValue(name);
  formResponses.getRange(responseCount+1, 3).setValue(pass);
  formResponses.getRange(responseCount+1, 4).setValue(type);
  formResponses.getRange(responseCount+1, 5).setValue(futures);
  formResponses.getRange(responseCount+1, 6).setValue(buy);
  
}

function groupInvestment() {
  let typeIndex = items.findIndex(typeList => typeList.getTitle() === typeQuest);
  let typeList = items[typeIndex];
  let type = target.getResponseForItem(typeList).getResponse();

  let nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQuest);
  let nameList = items[nameIndex];
  let name = target.getResponseForItem(nameList).getResponse();

  let passIndex = items.findIndex(passList => passList.getTitle() === passQuest);
  let passList = items[passIndex];
  let pass = target.getResponseForItem(passList).getResponse();

  let groupIndex = items.findIndex(groupList => groupList.getTitle() === groupQuest);
  let groupList = items[groupIndex];
  let group = target.getResponseForItem(groupList).getResponse();

  let investmentIndex = items.findIndex(investmentList => investmentList.getTitle() === investmentQuest);
  let investmentList = items[investmentIndex];
  let investment = Math.abs(target.getResponseForItem(investmentList).getResponse());

  let sheet = SpreadsheetApp.openById(ids[names.indexOf(name)]);
  let debtLimit = debtLimits[names.indexOf(name)];
  let values = chartStats.getRange(2, marketDay+1, stockCount, 1).getValues().flat();
  let netWorth = sheet.getSheetByName('portfolio').getRange('G1').getValue();
  let bankWorth = sheet.getSheetByName('portfolio').getRange('G2').getValue();

  if (netWorth < 0 || bankWorth < debtLimit) {
    return 0;
  }


  if (group == "Fall") {
    let fallTotal = values.reduce((sum, currentItem) => sum + (fallStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem : 0), 0);
    for (let i = 0; i < fallStocks.length; i++) {
      let percentage = values[fallStocks[i]-2]/fallTotal;
      sheet.getSheetByName('portfolio').getRange(fallStocks[i], 4).setValue(Math.floor((percentage * investment)/values[fallStocks[i]-2]));
      sheet.getSheetByName('portfolio').getRange(fallStocks[i], 3).setValue(sheet.getSheetByName('portfolio').getRange(fallStocks[i], 4).getValue() * values[fallStocks[i]-2]);
    }
  } else if (group == "Winter") {
    let winterTotal = values.reduce((sum, currentItem) => sum + (winterStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem : 0), 0);;
    for (let i = 0; i < winterStocks.length; i++) {
      let percentage = values[winterStocks[i]-2]/winterTotal;
      sheet.getSheetByName('portfolio').getRange(winterStocks[i], 4).setValue(Math.floor((percentage * investment)/values[winterStocks[i]-2]));
      sheet.getSheetByName('portfolio').getRange(winterStocks[i], 3).setValue(sheet.getSheetByName('portfolio').getRange(winterStocks[i], 4).getValue() * values[winterStocks[i]-2]);
    }
  } else if (group == "Spring") {
    let springTotal = values.reduce((sum, currentItem) => sum + (springStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem : 0), 0);;
    for (let i = 0; i < springStocks.length; i++) {
      let percentage = values[springStocks[i]-2]/springTotal;
      sheet.getSheetByName('portfolio').getRange(springStocks[i], 4).setValue(Math.floor((percentage * investment)/values[springStocks[i]-2]));
      sheet.getSheetByName('portfolio').getRange(springStocks[i], 3).setValue(sheet.getSheetByName('portfolio').getRange(springStocks[i], 4).getValue() * values[springStocks[i]-2]);
    }
  } else if (group == "Miscallenous") {
    let miscTotal = values.reduce((sum, currentItem) => sum + (miscStocks.indexOf(values.indexOf(currentItem) + 2) != -1 ? currentItem : 0), 0);;
    for (let i = 0; i < winterStocks.length; i++) {
      let percentage = values[miscStocks[i]-2]/miscTotal;
      sheet.getSheetByName('portfolio').getRange(miscStocks[i], 4).setValue(Math.floor((percentage * investment)/values[miscStocks[i]-2]));
      sheet.getSheetByName('portfolio').getRange(miscStocks[i], 3).setValue(sheet.getSheetByName('portfolio').getRange(miscStocks[i], 4).getValue() * values[miscStocks[i]-2]);
    }
  }

  dataStats.getRange('E6').setValue(dataStats.getRange('E6').getValue() + investment);

  formResponses.getRange(responseCount+1, 2).setValue(name);
  formResponses.getRange(responseCount+1, 3).setValue(pass);
  formResponses.getRange(responseCount+1, 4).setValue(type);
  formResponses.getRange(responseCount+1, 5).setValue(group);
  formResponses.getRange(responseCount+1, 6).setValue(investment);  
}

function giftShares () {
  let typeIndex = items.findIndex(typeList => typeList.getTitle() === typeQuest);
  let typeList = items[typeIndex];
  let type = target.getResponseForItem(typeList).getResponse();

  let nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQuest);
  let nameList = items[nameIndex];
  let name = target.getResponseForItem(nameList).getResponse();

  let passIndex = items.findIndex(passList => passList.getTitle() === passQuest);
  let passList = items[passIndex];
  let pass = target.getResponseForItem(passList).getResponse();

  let giftIndex = items.findIndex(giftList => giftList.getTitle() === giftQuest);
  let giftList = items[giftIndex];
  let gift = target.getResponseForItem(giftList).getResponse();

  let amountIndex = items.findIndex(amountList => amountList.getTitle() === amountQuest);
  let amountList = items[amountIndex];
  let amount = Math.round(Math.abs(target.getResponseForItem(amountList).getResponse()));

  let recipientIndex = items.findIndex(recipientList => recipientList.getTitle() === recipientQuest);
  let recipientList = items[recipientIndex];
  let recipient = target.getResponseForItem(recipientList).getResponse();

  let sheet = SpreadsheetApp.openById(ids[names.indexOf(name)]);
  let recipientSheet = SpreadsheetApp.openById(ids[names.indexOf(recipient)]);
  let currentRecipientQuantity = recipientSheet.getSheetByName('portfolio').getRange(tickers.indexOf(gift)+2, 4).getValue();
  let currentQuantity = sheet.getSheetByName('portfolio').getRange(tickers.indexOf(gift)+2, 4).getValue();
  let bankWorth = sheet.getSheetByName('portfolio').getRange('G2').getValue();
  let netWorth = sheet.getSheetByName('portfolio').getRange('G1').getValue();

  if (name == recipient) {
    return 0;
  }

  if (amount > currentQuantity) {
    amount = currentQuantity;
  }
  Logger.log(gift);
  Logger.log(amount);
  Logger.log(tickers.indexOf(gift)+2);
  
  recipientSheet.getSheetByName('portfolio').getRange(tickers.indexOf(gift)+2, 4).setValue(currentRecipientQuantity + amount);
  recipientSheet.getSheetByName('portfolio').getRange(tickers.indexOf(gift)+2, 3).setValue((recipientSheet.getSheetByName('portfolio').getRange(tickers.indexOf(gift)+2, 4).getValue()) * chartStats.getRange(tickers.indexOf(gift)+2, marketDay+1).getValue());
  sheet.getSheetByName('portfolio').getRange(tickers.indexOf(gift)+2, 4).setValue(currentQuantity - amount);
  sheet.getSheetByName('portfolio').getRange(tickers.indexOf(gift)+2, 3).setValue((sheet.getSheetByName('portfolio').getRange(tickers.indexOf(gift)+2, 4).getValue()) * chartStats.getRange(tickers.indexOf(gift)+2, marketDay+1).getValue());
  recipientSheet.getSheetByName('portfolio').getRange('G2').setValue(recipientSheet.getSheetByName('portfolio').getRange('G2').getValue() + (amount * chartStats.getRange(tickers.indexOf(gift)+2, marketDay+1).getValue()));
  sheet.getSheetByName('portfolio').getRange('G2').setValue(sheet.getSheetByName('portfolio').getRange('G2').getValue() - (amount * chartStats.getRange(tickers.indexOf(gift)+2, marketDay+1).getValue()));


  let fee = 0;
    if (netWorth > 10000000) {
      fee = 1.80;
    } else if (netWorth <= 10000000 && netWorth > 5000000) {
      fee = 1.35;
    } else if (netWorth <= 5000000 && netWorth > 2500000) {
      fee = 0.95;
    } else if (netWorth <=2500000 && netWorth > 1500000) {
      fee = 0.60;
    } else if (netWorth <= 1500000 && netWorth > 850000) {
      fee = 0.40;
    } else if (netWorth <= 850000 && netWorth > 200000) {
      fee = 0.25;
    } else if (netWorth <= 200000 && netWorth > 50000) {
      fee = 0.12;
    } else if (netWorth <= 50000) {
      fee = 0.07;
    }
  sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth - (fee * amount));

  formResponses.getRange(responseCount+1, 2).setValue(name);
  formResponses.getRange(responseCount+1, 3).setValue(pass);
  formResponses.getRange(responseCount+1, 4).setValue(type);
  formResponses.getRange(responseCount+1, 5).setValue(gift);
  formResponses.getRange(responseCount+1, 6).setValue(amount);
  formResponses.getRange(responseCount+1, 7).setValue(recipient); 
}
