_Refer to the images in the Getting Started Folder for a visual representation of how each tab should roughly look_

# A note on listing stocks

1. Make sure that stocks always appear in the same order across all sheets. If in one sheet, 'stock A' is on the first possible row, and 'stock B' is on the second possible row, they will always be in that order.
2. When determining tickers, make them 3-5 characters long (I prefer 4), and make them understandable. Tickers should be easy to remember as they are a shorthand for writing stocks, and if an investor has to look up what a ticker means every time, it'd just be easier to copy-paste the actual name of the stock. 

# Setting up the SSE

1. Make a Google Sheet and designate it as your main exchange sheet.
2. Name the first tab `Data & Statistics`
3. Name the second tab `Chart Statistics`
4. Create the third tab `Stock Exchange` **This sheet should be hidden**
5. Create the fourth tab `Buy & Sell Counts` **This sheet should be hidden**
6. Create the fifth tab `Passwords` **This sheet should be hidden**
7. In the `Data & Statistics` tab, in the A column, starting from row 3 and going down, insert the letter of the value column for each day. For the first 30 days, the value columns are

$$
K,
L,
Q,
V,
AA,
AF,
AK,
AP,
AU,
AZ,
BE,
BJ,
BO,
BT,
BY,
CD,
CI,
CN,
CS,
CX,
DC,
DH,
DM,
DR,
DW,
EB,
EG,
EL,
EQ,
EV,
FA,
FF
$$

**Do not add the commas, they are there to make viewing the list easier, but will break the code if actually used**

**I like to hide or make this column narrow**

# Setting up Index A

1. Make a Google Sheet and designate it as your main Index A sheet.
2. Name the first tab `Index A`
3. Manually input the Bias and Reliability for each stock.

# Setting up individual portfolios

1. Make a Google Sheet for an investor
2. Name the first tab `portfolio`
3. In the 'A1' cell, insert the first and last name of the investor
4. In the 'I2' cell, insert the password of the investor.
5. In the 'G2' cell, insert the starting budget of the investor.

# In-Sheet Code

## Data & Statistics

1. In the 'Price Rank' column, insert `=match($L3, SORT($L$3:$L, 1, False), 0)`, where L is the value column for that specific market day. Click and drag to fill the entire column.
2. In the 'Change Rank' column, insert `=match($N3, SORT($N$3:$N, 1, False), 0)`, where N is the percent change column for that specific market day. Click and drag to fill the entire column.
3. In the 'Shares for Sale' column, insert `='Stock Exchange'!C5`. Click and drag to fill the entire column
4. In cell 'B15' insert `=indirect($E$6 & 3)` Click and drag to fill the entire column. For an exchange of 40 stocks, you should end at 'B54'
5. In cell 'E6' insert `=indirect("'Data & Statistics'!A" & G1+2)`
6. In cell 'E7' insert `=indirect("'Data & Statistics'!A" & G1+1)`
7. In cell 'E3' insert `=round(sum(indirect(E6 & 3):indirect(E6 & 42)), 2)`
8. In cell 'E4' insert `=round(sum(indirect(E6 & 3):indirect(E6 & 42))-sum(K3:K42), 2)`
9. In cell 'E5' insert `=round(sum(indirect(E6 & 3):indirect(E6 & 42))-sum(indirect(E7 & 3):indirect(E7 & 42)))`
10. In cell 'E19' insert `=MAX(FILTER(ROW('SSE Form Responses'!B2:B), 'SSE Form Responses'!B2:B<>""))`
11. In cell 'D20' insert `=countif('Stock Exchange'!B3:AU3, "Last Row")`

## Stock Exchange

1. In the 'C' column, insert `=round(10000+('Data & Statistics'!$G$1*50)-(($D5 + $H5 + $L5 + $P5 + $T5 + $X5 + $AB5)/'Data & Statistics'!$B15))`. Add more to the 'D5 + H5, etc.' string as more investors are added to the exchange. Click and drag to fill the entire column
2. In the 'Current Value' column for each individual investor, insert `=ifna(if(Passwords!$B$1 = indirect("'SSE Form Responses'!$F" & E5), if(F5=E5, if(indirect("'SSE Form Responses'!$D" & E5) = 0, (indirect("'SSE Form Responses'!$D" & E5)-indirect("'SSE Form Responses'!$E" & E5))*'Data & Statistics'!$B15, "FRAUD DETECTED: LIED ABOUT NET WORTH"), if(indirect("'SSE Form Responses'!$D" & E5)=indirect("'SSE Form Responses'!$D" & F5)-indirect("'SSE Form Responses'!$E" & F5),(indirect("'SSE Form Responses'!$D" & E5)-indirect("'SSE Form Responses'!$E" & E5))*'Data & Statistics'!$B15, "FRAUD DETECTED: LIED ABOUT NET WORTH" )), "FRAUD DETECTED: WRONG PASSWORD"), 0)`. Click and drag to fill the entire column. You should just be able to copy-paste this into the next investor's column, although the passwords cell (Passwords!B$$1 in this case) will need to be changed for each individual investor. 
3. In the 'Last Row' column, insert `=max(filter(row('SSE Form Responses'!$C$2:$C), 'SSE Form Responses'!$C$2:$C = $B5, 'SSE Form Responses'!$B$2:$B = D$2))`. Click and drag to fill the entire column. You should just be able to copy-paste this into the next investor's column
4. In the 'Second to Last Row' column, insert `=ifna(max(filter(row(indirect("'SSE Form Responses'!$C" & 2):indirect("'SSE Form Responses'!$C" & E5-1)), indirect("'SSE Form Responses'!$C" & 2):indirect("'SSE Form Responses'!$C" & E5-1) = $B5, indirect("'SSE Form Responses'!$B" & 2):indirect("'SSE Form Responses'!$B" & E5-1) = D$2)), E5)`. Click and drag to fill the entire column. You should just be able to copy-paste this into the next investor's column
5. In the 'D1' cell, insert `=CONCAT("Market Day: ", 'Data & Statistics'!G1)`

## Index A

1. In the final row of the H column (For a market of 40 stocks this is cell 'H42'), insert `=if(G42=1, "D", if(G42=2, "C", if(G42=3, "B", if(G42=4, "A", ""))))`.
2. In the 'N3' cell, insert `=countif(H2:H41, "B")+countif(H2:H41, "A")`. Adjust 41 to the number of stocks in your exchange + 1.
3. In the 'N4' cell, insert `=round((sumif(H2:H41, "B", I2:I41)+sumif(H2:H41, "A", I2:I41))/N3, 2)`

## Individual Portfolios

1. In the 'C42' cell, insert `=sum(C2:C41)`
2. In the 'D42' cell, insert `=sum(D2:D41)`

_again, note that 42 and 41 are just the number of stocks in market (40 in this case) + 2 and 1 respectively__

3. In the 'G1' cell, insert `=C42+G2` 

