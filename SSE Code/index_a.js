const stockCount = 40; //how many stocks does your exchange track

function activateIndexA() {
  ScriptApp.newTrigger("setIndexA")
  .timeBased()
  .everyDays(1)
  .atHour(8)
  .create();
}

function setIndexA() {
  var index = SpreadsheetApp.openById('1RpJGP2iYOQlN9P2PYhegDHL3YVZkeqrfW-Dff3O5FUQ');
  var exchange = SpreadsheetApp.openById('1-Sfu8HYWWFhKURlv45RU6BtAUC7xoA7nOO8HWimRoPY');
  var marketDay = exchange.getSheetByName('Data & Statistics').getRange('G1').getValue();
  if (marketDay === 1) {
    var marketDayColumn = 10;
  } else if (marketDay > 1) {
    var marketDayColumn = 12 + ((marketDay - 2) * 5);
  }
  var chart = exchange.getSheetByName('Thurman Index').getCharts()[0];
  var blankChart = chart.modify().clearRanges().asLineChart();
  var xAxis = exchange.getSheetByName('Chart Statistics').getRange(1, 1, , 1, marketDay+1);
  blankChart.addRange(xAxis);
  var newRows = [];

  for (var i = 0; i < 40; i++) {
    var profitChange = 0.00222222 * (exchange.getSheetByName('Data & Statistics').getRange(i+3, marketDayColumn+1).getValue()+2500);
    index.getSheetByName('Index A').getRange(i + 2, 5).setValue(profitChange);
  }

  // calculate group bias as the proportion of total stock trades that a stock makes up and output that value in column D
  var biasIncrease = index.getSheetByName('Index A').getRange('B2:B41').getValues().flat().filter(String);  
  var dataList = exchange.getSheetByName('SSE Form Responses').getRange('C2:C').getValues().flat();
  for (var i = 0; i < 40; i++) {
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

    //value trend

    for (var i = 0; i < 40; i++) {
      var valueTrend = -0.008 * Math.abs(exchange.getSheetByName('Chart Statistics').getRange(i+2, marketDay+1).getValue() - 1250) + 10
      index.getSheetByName('Index A').getRange(i+2, 3).setValue(valueTrend);
    }


    // sum all the values in a row, round up, and output them in column G
    for (var i = 0; i < 40; i++) {
      var biasValue = index.getSheetByName('Index A').getRange(i+2, 3).getValue();
      var groupBiasValue = index.getSheetByName('Index A').getRange(i+2, 4).getValue();
      var profitChangeValue = index.getSheetByName('Index A').getRange(i+2, 5).getValue();

      var numberRating = biasValue + groupBiasValue + profitChangeValue;

      index.getSheetByName('Index A').getRange(i+2, 7).setValue(Math.ceil(numberRating));
    }

    // give each stock a letter rating (A, B, C, D) depending on the corresponding number rating. 
    
    for (var i = 0; i < 40; i++) {
      if (index.getSheetByName('Index A').getRange(i+2, 7).getValue() >= 0 && index.getSheetByName('Index A').getRange(i+2, 7).getValue() <= 6) {
        index.getSheetByName('Index A').getRange(i+2, 8).setValue("D");
      } else if (index.getSheetByName('Index A').getRange(i+2, 7).getValue() >= 7 && index.getSheetByName('Index A').getRange(i+2, 7).getValue() <= 15) {
        index.getSheetByName('Index A').getRange(i+2, 8).setValue("C");
      } else if (index.getSheetByName('Index A').getRange(i+2, 7).getValue() >= 16 && index.getSheetByName('Index A').getRange(i+2, 7).getValue() <= 23) {
        index.getSheetByName('Index A').getRange(i+2, 8).setValue("B");
        newRows.push(i+2);
      } else if (index.getSheetByName('Index A').getRange(i+2, 7).getValue() >= 24) {
        index.getSheetByName('Index A').getRange(i+2, 8).setValue("A");
        newRows.push(i+2);
      }
    }  
  Logger.log(newRows);
  for (var i = 0; i < newRows.length; i++) {
    var range = exchange.getSheetByName('Chart Statistics').getRange(newRows[i], 1, 1, marketDay+1); 
    blankChart.addRange(range);
    blankChart.setOption("pointSize", 2);
    blankChart.setOption("vAxes", {
      0: { side: "right" }
    });
  }


  var updatedChart = blankChart.build();
  exchange.getSheetByName('Index A').updateChart(updatedChart);

}
