function setupTrigger() {
  var form = FormApp.openById('1JqVutP7Q_T76wFBu3nUvnmk2EnEfzuamR-6BJsaYi7g');
  ScriptApp.newTrigger("onFormSubmitHandler")
    .forForm(form)
    .onFormSubmit()
    .create();
}

function onFormSubmitHandler(e) {
  const form = FormApp.openById();
  const exchange = SpreadsheetApp.openById();

  const nameQuest = "What's your name?";
  const stockQuest = "What stock do you want to exchange";
  const sellQuest = "How much of that stock do you wish to sell?";
  const passQuest = "What is your SSE password";
  const bidQuest = "What is the highest price you'd be willing to buy this stock at on the next market day?";

  const responses = form.getResponses();
  const formLength = responses.length;
  const target = responses[formLength - 1];
  const items = form.getItems();

  var nameIndex = items.findIndex(nameList => nameList.getTitle() === nameQuest);
  var nameList = items[nameIndex];
  var name = target.getResponseForItem(nameList).getResponse();

  var stockIndex = items.findIndex(stockList => stockList.getTitle() === stockQuest);
  var stockList = items[stockIndex];
  var stock = target.getResponseForItem(stockList).getResponse();
  
  var sellIndex = items.findIndex(sellList => sellList.getTitle() === sellQuest);
  var sellList = items[sellIndex];
  var sell = target.getResponseForItem(sellList).getResponse();

  var passIndex = items.findIndex(passList => passList.getTitle() === passQuest);
  var passList = items[passIndex];
  var pass = target.getResponseForItem(passList).getResponse();

  var bidIndex = items.findIndex(bidList => bidList.getTitle() === bidQuest);
  var bidList = items[bidIndex];
  var bid = target.getResponseForItem(bidList).getResponse();

  const stocks = [];
  // ↑ insert the ticker of the stock, in the order they appear in on the actual google sheet. Across all sheets, the order MUST be the same
  

  if (name === "") {
    var sheet = SpreadsheetApp.openById(');
  } else if (name === "") {
    var sheet = SpreadsheetApp.openById();
  } 

  // ↑ repeat for every investor

  var row = stocks.indexOf(stock);
  var marketDay = exchange.getSheetByName('Data & Statistics').getRange('G1').getValue();
  var marketDayColumn = (12 + (marketDay - 2) * 5);
  
  if (name === "") {
    var column = ;
  } else if (name === "") {
    var column = ;
  }

  // ↑ repeat for every investor. This is the 'Current Value' column on the 'Stock Exchange' tab of the main exchange sheet.

  if (exchange.getSheetByName('Stock Exchange').getRange(row+6, column).getValue() !== "FRAUD DETECTED: LIED ABOUT NET WORTH" && exchange.getSheetByName('Stock Exchange').getRange(row+6, column).getValue() !== "FRAUD DETECTED: WRONG PASSWORD") {
    var netWorth = sheet.getSheetByName('portfolio').getRange('G1').getValue();
    var bankWorth = sheet.getSheetByName('portfolio').getRange('G2').getValue();
    if (netWorth > 0) {
      if (sell < 0 && bankWorth > 0) {
        var currentValue = sheet.getSheetByName('portfolio').getRange(row + 2, 3).getValue(); 
        var currentCount = sheet.getSheetByName('portfolio').getRange(row + 2, 4).getValue();
        var bankWorth = sheet.getRange('G2').getValue();
        if (exchange.getSheetByName('Data & Statistics').getRange(row + 3, 10).getValue() >= Math.abs(sell)) {
          sheet.getSheetByName('portfolio').getRange(row + 2, 3).setValue(currentValue - (sell * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()));
          sheet.getSheetByName('portfolio').getRange(row + 2, 4).setValue(currentCount - sell);
          sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + ((sell) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()));
        } else if (exchange.getSheetByName('Data & Statistics').getRange(row + 3, 10).getValue() < Math.abs(sell)) {
          var sell = -1 * exchange.getSheetByName('Data & Statistics').getRange(row + 3, 10).getValue();
          sheet.getSheetByName('portfolio').getRange(row + 2, 3).setValue(currentValue - (sell * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()));
          sheet.getSheetByName('portfolio').getRange(row + 2, 4).setValue(currentCount - sell);
          sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + ((sell) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()));
        }
      } else if (sell > 0) {
        var currentValue = sheet.getSheetByName('portfolio').getRange(row + 2, 3).getValue(); 
        var currentCount = sheet.getSheetByName('portfolio').getRange(row + 2, 4).getValue();
        var bankWorth = sheet.getSheetByName('portfolio').getRange('G2').getValue();
        var netWorth = sheet.getSheetByName('portfolio').getRange('G1').getValue();

        sheet.getSheetByName('portfolio').getRange(row + 2, 3).setValue(currentValue - (sell * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()));
        sheet.getSheetByName('portfolio').getRange(row + 2, 4).setValue(currentCount - sell);
        if (netWorth > bankWorth) {
          if (netWorth > 5000000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.60));
          } else if (netWorth <= 5000000 && netWorth > 2500000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.63));
          } else if (netWorth <=2500000 && netWorth > 1500000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.67));
          } else if (netWorth <= 1500000 && netWorth > 850000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.72));
          } else if (netWorth <= 850000 && netWorth > 200000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.78));
          } else if (netWorth <= 200000 && netWorth > 50000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.85));
          } else if (netWorth <= 50000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.88));
          }
        } else if (bankWorth > netWorth) {
            if (bankWorth > 5000000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.60));
          } else if (bankWorth <= 5000000 && bankWorth > 2500000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.63));
          } else if (bankWorth <=2500000 && bankWorth > 1500000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.67));
          } else if (bankWorth <= 1500000 && bankWorth > 850000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.72));
          } else if (bankWorth <= 850000 && bankWorth > 200000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.78));
          } else if (bankWorth <= 200000 && bankWorth > 50000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.85));
          } else if (bankWorth <= 50000) {
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth + (((sell ) * exchange.getSheetByName('Chart Statistics').getRange(row + 2, marketDay+1).getValue()) * 0.88));
          }
        } 
        sheet.getSheetByName('data').getRange(row+2, 4).setValue(marketDay);
      }

      var now = new Date();
      var responseCount = exchange.getSheetByName('Data & Statistics').getRange('e19').getValue();
      exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 1).setValue(now.getMonth()+1 + '/' + now.getDate() + '/' + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + 00);
      exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 2).setValue(name);
      exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 3).setValue(stock);
      exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 4).setValue(currentCount);
      Logger.log(currentCount);
      exchange.getSheetByName('SSE Form Responses').getRange(responseCount + 1, 5).setValue(sell);
      exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 6).setValue(pass);
      if (bid < exchange.getSheetByName('Buy & Sell Counts').getRange(row+2, 4).getValue()) {
        exchange.getSheetByName('Buy & Sell Counts').getRange(row+2, 4).setValue(bid);
      }
    }
  }
}

function giftShares() {
  const exchange = SpreadsheetApp.openById();
  var marketDay = exchange.getSheetByName('Data & Statistics').getRange('G1').getValue();
  // list of sheet IDs for every individual investor portfolio. should be in the samed order as passwords and names
  const ids = [];
  // insert stock tickers in the order they appear in on the sheet
  const stocks = [];
  // first and last names of investors
  const names = [];
  // investor emails
  const emails = [];
  // investment passwords
  const passwords = [];
    for (var i = 0; i < ids.length; i++) {
    var sheet = SpreadsheetApp.openById(ids[i]);
    for (var j = 0; j < stocks.length; j++) {
      if (sheet.getSheetByName('portfolio').getRange('g7').getValue() === names[j]) {
        for (var k = 0; k < stocks.length; k++) {
          if (sheet.getSheetByName('portfolio').getRange('g6').getValue() === stocks[k]) {
            var recipientSheet = SpreadsheetApp.openById(ids[j]);
            var quantity = sheet.getSheetByName('portfolio').getRange('g5').getValue();
            var currentQuantity = recipientSheet.getSheetByName('portfolio').getRange(k+2, 4).getValue();
            recipientSheet.getSheetByName('portfolio').getRange(k+2, 4).setValue(currentQuantity + Math.abs(quantity));
            var marketDay = exchange.getSheetByName('Data & Statistics').getRange('g1').getValue();
            var price = exchange.getSheetByName('Chart Statistics').getRange(k+2, marketDay+1).getValue();
            var currentWorth = recipientSheet.getSheetByName('portfolio').getRange(k+2, 3).getValue();
            recipientSheet.getSheetByName('portfolio').getRange(k+2, 3).setValue(currentWorth + (Math.abs(quantity) * price));
            var currentSenderQt = sheet.getSheetByName('portfolio').getRange(k+2, 4).getValue();
            var currentSenderWrth = sheet.getSheetByName('portfolio').getRange(k+2, 3).getValue();
            sheet.getSheetByName('portfolio').getRange(k+2, 4).setValue(currentSenderQt - Math.abs(quantity));
            sheet.getSheetByName('portfolio').getRange(k+2, 3).setValue(currentSenderWrth - (Math.abs(quantity) * price));
            sheet.getSheetByName('portfolio').getRange('g5').setValue("");
            sheet.getSheetByName('portfolio').getRange('g6').setValue("");
            sheet.getSheetByName('portfolio').getRange('g7').setValue("");
            var responseCount = exchange.getSheetByName('Data & Statistics').getRange('e19').getValue();
            var now = new Date();

            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 1).setValue(now.getMonth()+1 + '/' + now.getDate() + '/' + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + 00);
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 2).setValue(names[j]);
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 3).setValue(stocks[k]);
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 4).setValue(currentQuantity);            
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 5).setValue(-Math.abs(quantity));
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+1, 6).setValue(sheet.getSheetByName('portfolio').getRange('i2').getValue());

            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+2, 1).setValue(now.getMonth()+1 + '/' + now.getDate() + '/' + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + 00);
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+2, 2).setValue(sheet.getSheetByName('portfolio').getRange('A1').getValue());
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+2, 3).setValue(stocks[k]);
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+2, 4).setValue(currentSenderQt);
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+2, 5).setValue(Math.abs(quantity));
            exchange.getSheetByName('SSE Form Responses').getRange(responseCount+2, 6).setValue(sheet.getSheetByName('portfolio').getRange('i2').getValue());
            MailApp.sendEmail(
              emails[j],
              'Share Gifted',
              'You have been gifted ' + quantity + ' shares of ' + stocks[k]
            );

            var netWorth = sheet.getSheetByName('portfolio').getRange('G1').getValue();
            var bankWorth = sheet.getSheetByName('portfolio').getRange('G2').getValue(); 
            if (netWorth > bankWorth) {
              if (netWorth > 5000000) {
                var fee = 0.5
              } else if (netWorth <= 5000000 && netWorth > 2500000) {
                var fee = 0.33
              } else if (netWorth <=2500000 && netWorth > 1500000) {
                var fee = 0.27
              } else if (netWorth <= 1500000 && netWorth > 850000) {
                var fee = 0.12
              } else if (netWorth <= 850000 && netWorth > 200000) {
                var fee = 0.05
              } else if (netWorth <= 200000 && netWorth > 50000) {
                var fee = 0.03
              } else if (netWorth <= 50000) {
                var fee = 0.01
              }
            } else if (bankWorth > netWorth) {
              if (bankWorth > 5000000) {
                var fee = 0.5
              } else if (bankWorth <= 5000000 && bankWorth > 2500000) {
                var fee = 0.33
              } else if (bankWorth <=2500000 && bankWorth > 1500000) {
                var fee = 0.27
              } else if (bankWorth <= 1500000 && bankWorth > 850000) {
                var fee = 0.12
              } else if (bankWorth <= 850000 && bankWorth > 200000) {
                var fee = 0.05
              } else if (bankWorth <= 200000 && bankWorth > 50000) {
                var fee = 0.03
              } else if (bankWorth <= 50000) {
                var fee = 0.01
              }
            }
            sheet.getSheetByName('portfolio').getRange('G2').setValue(bankWorth - (quantity * fee));
            if (recipientSheet.getSheetByName('portfolio').getRange(k+2, 4).getValue() === 0) {
              recipientSheet.getSheetByName('data').getRange(k+2, 3).setValue(marketDay);
              sheet.getSheetByName('data').getRange(k+2, 4).setValue(marketDay);
            }
        }
      }
    }
  }
}
}
