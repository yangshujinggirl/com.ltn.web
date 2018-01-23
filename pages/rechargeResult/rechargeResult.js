import './rechargeResult.scss';
timeOut(5);
function timeOut(wait) {
  if (wait == 0) {
    window.close();
  } else {
    setTimeout(function() {
      wait--;
      document.getElementById('countdown').innerHTML=wait+'s';
      timeOut(wait);
    }, 1000)
  }
}
