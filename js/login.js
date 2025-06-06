import { setCookie, getCookie } from './cookie.js';
import {
  session_set,
  session_get,
  session_check,
  session_del
} from './session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT } from './jwt_token.js';

// XSS 필터링 함수
const check_xss = (input) => {
  const DOMPurify = window.DOMPurify;
  const sanitizedInput = DOMPurify.sanitize(input);
  if (sanitizedInput !== input) {
    alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
    return false;
  }
  return sanitizedInput;
};

// 로그인 실패 횟수 제한
function login_failed() {
  let failCount = parseInt(getCookie('login_failed_cnt')) || 0;
  failCount++;
  setCookie('login_failed_cnt', failCount, 1);

  if (failCount >= 3) {
    alert('로그인 가능 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
    return false;
  }
  return true;
}

// 로그인, 로그아웃 카운트 기록용
function login_count() {
  let count = parseInt(getCookie('login_cnt')) || 0;
  setCookie('login_cnt', count + 1, 1);
}
function logout_count() {
  let count = parseInt(getCookie('logout_cnt')) || 0;
  setCookie('logout_cnt', count + 1, 1);
}

// 입력 유효성 검사 및 로그인 처리
const check_input = async () => {
  if (!login_failed()) return false;

  const loginForm = document.getElementById('login_form');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');
  const idSaveCheck = document.getElementById('idSaveCheck');

  let emailValue = emailInput.value.trim();
  let passwordValue = passwordInput.value.trim();

  const sanitizedEmail = check_xss(emailValue);
  const sanitizedPassword = check_xss(passwordValue);
  if (!sanitizedEmail || !sanitizedPassword) return false;

  if (sanitizedEmail === '') {
    alert('이메일을 입력하세요.');
    return false;
  }
  if (sanitizedPassword === '') {
    alert('비밀번호를 입력하세요.');
    return false;
  }

  if (sanitizedEmail.length < 5 || sanitizedEmail.length > 10) {
    alert('아이디는 5~10글자로 입력해야 합니다.');
    return false;
  }
  if (sanitizedPassword.length < 12 || sanitizedPassword.length > 15) {
    alert('비밀번호는 12~15글자로 입력해야 합니다.');
    return false;
  }

  const repeat3Pattern = /(.{3,})\1+/;
  const repeat2DigitPattern = /(\d{2})\1+/;
  if (repeat3Pattern.test(sanitizedEmail) || repeat3Pattern.test(sanitizedPassword) ||
      repeat2DigitPattern.test(sanitizedEmail) || repeat2DigitPattern.test(sanitizedPassword)) {
    alert('반복되는 패턴은 사용할 수 없습니다.');
    return false;
  }

  const hasSpecialChar = /[!,.@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(sanitizedPassword);
  const hasUpperCase = /[A-Z]+/.test(sanitizedPassword);
  const hasLowerCase = /[a-z]+/.test(sanitizedPassword);
  if (!hasSpecialChar || !hasUpperCase || !hasLowerCase) {
    alert('비밀번호는 특수문자와 대소문자를 포함해야 합니다.');
    return false;
  }

  // 아이디 저장 여부
  if (idSaveCheck.checked) {
    setCookie('id', sanitizedEmail, 7);
  } else {
    setCookie('id', '', 0);
  }

  // JWT 발급 및 저장
  const payload = {
    id: sanitizedEmail,
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  const jwtToken = generateJWT(payload);
  localStorage.setItem('jwt_token', jwtToken);

  await session_set();
  login_count();
  setCookie('login_failed_cnt', '', 0);
  loginForm.submit();
};

// 로그아웃 처리
function logout() {
  session_del();
  localStorage.removeItem('jwt_token');
  logout_count();
  location.href = '../index.html';
}

// 로그인 시 아이디 자동 입력 및 세션 체크
function init() {
  const emailInput = document.getElementById('typeEmailX');
  const idSaveCheck = document.getElementById('idSaveCheck');
  const savedId = getCookie('id');

  if (savedId) {
    emailInput.value = savedId;
    idSaveCheck.checked = true;
  }
  session_check();
}

// 로그인된 경우 비밀번호 복호화
function init_logined() {
  if (sessionStorage) {
    decrypt_text();
    const encryptedGCM = sessionStorage.getItem("Session_Storage_pass2");
    if (encryptedGCM) {
      decryptGCM(encryptedGCM, "my_secure_key").then((decrypted) => {
        console.log("복호화된 GCM 비밀번호:", decrypted);
      }).catch(err => {
        console.error("GCM 복호화 오류:", err);
      });
    }
  } else {
    alert("세션 스토리지 지원 x");
  }
}

// 페이지 로드시 로그인 버튼 이벤트 연결
window.onload = function () {
  init();
  const loginButton = document.getElementById("login_btn");
  if (loginButton) {
    loginButton.addEventListener('click', check_input);
  }
};
