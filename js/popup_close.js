let seconds = 50; // 시작 시간 (초 단위)

// 1초마다 호출되어 시간을 감소시키는 함수
function countdown() {
  seconds--; // 1초 감소
  document.getElementById('Time').innerText = seconds; // 화면에 남은 시간 표시

  if (seconds <= 0) {
    window.close(); // 시간이 다 되면 창 닫기
  } else {
    setTimeout(countdown, 1000); // 1초 후 다시 countdown 함수 실행
  }
}

// 페이지 로딩이 끝나면 타이머 시작
window.onload = countdown;
