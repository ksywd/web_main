import { getCookie } from './cookie.js';

// 팝업 차단 쿠키가 없으면 팝업 창 띄우기
function pop_up() {
  const popupCheck = getCookie('popupYN');
  if (popupCheck !== 'N') {
    window.open("popup/popup.html", "popup", "width=400,height=300,top=10,left=10");
  }
}

// 현재 시간 출력 함수 (1초마다 갱신)
function show_time() {
  let currentDate = new Date();
  let divClock = document.getElementById('divClock');
  let msg = "현재 시간 : ";

  if (currentDate.getHours() > 12) {
    msg += "오후 ";
    msg += (currentDate.getHours() - 12) + "시 ";
  } else {
    msg += "오전 ";
    msg += currentDate.getHours() + "시 ";
  }

  msg += currentDate.getMinutes() + "분 ";
  msg += currentDate.getSeconds() + "초";
  divClock.innerText = msg;

  setTimeout(show_time, 1000); // 1초마다 갱신
}

// 팝업 창 닫기 + 체크 시 쿠키 설정
function closePopup() {
  const checkbox = document.getElementById('check_popup');
  if (checkbox && checkbox.checked) {
    setCookie('popupYN', 'N', 1); // 하루 동안 팝업 차단
    window.close();
  }
}
