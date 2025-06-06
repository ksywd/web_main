// 쿠키 설정: name, value 값을 days일 동안 유지
function setCookie(name, value, days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/; SameSite=None; Secure";
}

// 쿠키 가져오기: name에 해당하는 값 반환
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cName, cValue] = cookie.trim().split('=');
    if (cName === name) return unescape(cValue);
  }
  return null;
}

export { setCookie, getCookie };
