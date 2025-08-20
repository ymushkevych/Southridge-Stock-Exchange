_Refer to the images in the Getting Started Folder for a visual representation of how each tab should roughly look_

# Setting up the SSE

1. Make a Google Sheet and designate it as your main exchange sheet.
2. Name the first tab `Data & Statistics`
3. Name the second tab `Chart Statistics`
4. Create the third tab `Stock Exchange` **This sheet should be hidden**
5. Create the fourth tab `Buy & Sell Counts` **This sheet should be hidden**
6. Create the fifth tab `Passwords` **This sheet should be hidden**

# Setting up Index A

1. Make a Google Sheet and designate it as your main Index A sheet.
2. Name the first tab `Index A`
3. Manually input the Bias and Reliability for each stock.

# In-Sheet Code

## Data & Statistics

1. In the 'Price Rank' column, insert `=match($L3, SORT($L$3:$L, 1, False), 0)`, where L is the value column for that specific market day. Click and drag to fill the entire column.
2. In the 'Change Rank' column, insert `=match($N3, SORT($N$3:$N, 1, False), 0)`, where N is the percent change column for that specific market day. Click and drag to fill the entire column.
3. In the 'Shares for Sale' column, insert `='Stock Exchange'!C5`. Click and drag to fill the entire column

## Stock Exchange

1. In the 'C' column, insert `=round(10000+('Data & Statistics'!$G$1*50)-(($D5 + $H5 + $L5 + $P5 + $T5 + $X5 + $AB5)/'Data & Statistics'!$B15))`. Add more to the 'D5 + H5, etc.' string as more investors are added to the exchange. Click and drag to fill the entire column
2. In the 'Current Value' column for each individual investor, insert `=ifna(if(Passwords!$B$1 = indirect("'SSE Form Responses'!$F" & E5), if(F5=E5, if(indirect("'SSE Form Responses'!$D" & E5) = 0, (indirect("'SSE Form Responses'!$D" & E5)-indirect("'SSE Form Responses'!$E" & E5))*'Data & Statistics'!$B15, "FRAUD DETECTED: LIED ABOUT NET WORTH"), if(indirect("'SSE Form Responses'!$D" & E5)=indirect("'SSE Form Responses'!$D" & F5)-indirect("'SSE Form Responses'!$E" & F5),(indirect("'SSE Form Responses'!$D" & E5)-indirect("'SSE Form Responses'!$E" & E5))*'Data & Statistics'!$B15, "FRAUD DETECTED: LIED ABOUT NET WORTH" )), "FRAUD DETECTED: WRONG PASSWORD"), 0)`. Click and drag to fill the entire column. You should just be able to copy-paste this into the next investor's column, although the passwords cell (Passwords!B$$1 in this case) will need to be changed for each individual investor. 
3. In the 'Last Row' column, insert `=max(filter(row('SSE Form Responses'!$C$2:$C), 'SSE Form Responses'!$C$2:$C = $B5, 'SSE Form Responses'!$B$2:$B = D$2))`. Click and drag to fill the entire column. You should just be able to copy-paste this into the next investor's column
4. In the 'Second to Last Row' column, insert `=ifna(max(filter(row(indirect("'SSE Form Responses'!$C" & 2):indirect("'SSE Form Responses'!$C" & E5-1)), indirect("'SSE Form Responses'!$C" & 2):indirect("'SSE Form Responses'!$C" & E5-1) = $B5, indirect("'SSE Form Responses'!$B" & 2):indirect("'SSE Form Responses'!$B" & E5-1) = D$2)), E5)`. Click and drag to fill the entire column. You should just be able to copy-paste this into the next investor's column

## Index A

1. In the final row of the H column (For a market of 40 stocks this is cell 'H42'), insert `=if(G42=1, "D", if(G42=2, "C", if(G42=3, "B", if(G42=4, "A", ""))))`.
2. In the 'N3' cell, insert `=countif(H2:H41, "B")+countif(H2:H41, "A")`. Adjust 41 to the number of stocks in your exchange + 1.
3. In the 'N4' cell, insert `=round((sumif(H2:H41, "B", I2:I41)+sumif(H2:H41, "A", I2:I41))/N3, 2)`



