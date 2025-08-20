_refer to the images in the Getting Started Folder for a visual representation of how each tab should roughly look_

# Setting up the SSE

1. Make a Google Sheet and designate it as your main exchange sheet.
2. Name the first tab `Data & Statistics`
3. Name the second tab `Chart Statistics`
4. Create the third tab `Stock Exchange`
5. Create the fourth tab `Buy & Sell Counts`

# In-Sheet Code

## Data & Statistics

In the `Data & Statistics` tab, insert the following code:

For the 'Price Rank' column, insert `=match($L3, SORT($L$3:$L, 1, False), 0)`, where L is the value column for that specific market day
For the 'Change Rank' column, insert `=match($N3, SORT($N$3:$N, 1, False), 0)`, where N is the percent change column for that specific market day


