function changeFormStatus() {
  // defining variables and which forms and sheets to track
  let marketState = dataStats.getRange('C1').getValue();
  let currentTime = now.getHours() * 60 + now.getMinutes();
  let isOpenTime = currentTime >= openingTime && currentTime <= closingTime;
  // defining the status variable to be "OPEN" if within open hours, else "CLOSED"
  let status = (isWeekday && isOpenTime) ? "OPEN" : "CLOSED";

  if (isMarketDown == false) {
    if (closeCell.getValue() === 'N') {
      if (openCell.getValue() === 'Y') {
        dataStats.getRange('C1').setValue('OPEN');
      } else if (openCell.getValue() === 'N') {
        dataStats.getRange('C1').setValue(status);
      }
    } else if (closeCell.getValue() === 'Y') {
      dataStats.getRange('C1').setValue('CLOSED');
    }

    if (formCloseCell.getValue() === "N") {
      if (formOpenCell.getValue() === "N") {
        if (marketState === 'CLOSED') {
          form.setAcceptingResponses(false);
        } else if (marketState === 'OPEN') {
          form.setAcceptingResponses(true);
        }
      } else if (formOpenCell.getValue() === "Y") {
        if (formCloseCell.getValue() === "N") {
          form.setAcceptingResponses(true);
        } else {
          if (marketState === 'CLOSED') {
          form.setAcceptingResponses(false);
        } else if (marketState === 'OPEN') {
          form.setAcceptingResponses(true);
        }
        }
      }
    } else if (formCloseCell.getValue() === "Y") {
      if (formOpenCell.getValue() === "N") {
        form.setAcceptingResponses(false);
      } else {
        if (marketState === 'CLOSED') {
          form.setAcceptingResponses(false);
        } else if (marketState === 'OPEN') {
          form.setAcceptingResponses(true);
        }
      }
    }
  }
}

function setResetPattern() {
  ScriptApp.newTrigger("resetRunCount")
  .timeBased()
  .everyDays(1)
  .atHour(14)
  .nearMinute(35)
  .create();
}

function resetRunCount() {
  dataStats.getRange('E20').setValue('0');
}
