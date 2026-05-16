const stockCount = 38;
const main = SpreadsheetApp.openById(); // main exchange sheet
const buySellCounts = main.getSheetByName('Buy & Sell Counts');
const dataStats = main.getSheetByName('Data & Statistics'); // data & statistics
const chartStats = main.getSheetByName('Chart Statistics'); // chart statistics
const biases = main.getSheetByName('Bias');
const formResponses = main.getSheetByName('SSE Form Responses');
const ratingHist = main.getSheetByName('Rating History');
const ids = [];
const marketDay = main.getSheetByName('Data & Statistics').getRange('G1').getValue();
const fallStocks = [7, 8, 10, 15, 16, 31];
const winterStocks = [5, 6, 23, 29, 30, 34, 35, 36];
const springStocks = [11, 12, 13, 14, 17, 24, 25, 27, 32, 33];
const miscStocks = [2, 3, 4, 9, 18, 19, 20, 21, 26, 37, 38, 39, 28, 22];
const tickers = ['SKBX','SKMT','THTR','BBTB','GBTB','BSCR','GSCR','DNCE','FTBL','BSBL','BTNS','GTNS','SFTB','BVLB','GVLB','TRCK','CNCS','RFFL','HKHT','STSK','BAND','SWMG','BLCR','GLCR','CHRL','HWKT','CHOR','BWRS','GWRS','CRSC','GGLF','BGLF','RCQT','SKNG','SNBD','PLCC','ASBS','BTDG'];
const now = new Date();
let isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
const openingTime = 8 * 60 + 45;
const closingTime = 15 * 60 + 45;
const form = FormApp.openById();
let formOpenCell = dataStats.getRange("E13");
let formCloseCell = dataStats.getRange("E12");
let openCell = dataStats.getRange("C12");
let closeCell = dataStats.getRange("C13");
const names = [];
const debtLimits = [];
const emails = [];
const passwords = [];
let marketDayColumn = 0;
if (marketDay === 1) {
  marketDayColumn = 10;
} else if (marketDay > 1) {
  marketDayColumn = 12 + ((marketDay - 2) * 5);
}
let marketMoney = dataStats.getRange('E6').getValue();
let isMarketDown = false;
let splitRatio = 1;
const actions = ["Buy or Sell shares", "Gift Shares", "Buy Futures", "Invest in a Stock Group"];
const responses = form.getResponses();
const formLength = responses.length;
const target = responses[formLength - 1];
const items = form.getItems();
let responseCount = dataStats.getRange('E19').getValue();
let investors = 11;

const signupForm = FormApp.openById(); 
