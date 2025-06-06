let seconds = 50;

function countdown() {
  seconds--;
  document.getElementById('Time').innerText = seconds;

  if (seconds <= 0) {
    window.close();
  } else {
    setTimeout(countdown, 1000);
  }
}

window.onload = countdown;
