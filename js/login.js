import { setCookie, getCookie } from './cookie.js';
import {
  session_set,
  session_get,
  session_check,
  session_del
} from './session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT } from './jwt_token.js';

const check_xss = (input) => {
  const DOMPurify = window.DOMPurify;
  const sanitizedInput = DOMPurify.sanitize(input);
  if (sanitizedInput !== input) {
    alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
    return false;
  }
  return sanitizedInput;
};

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

function login_count() {
  let count = parseInt(getCookie('login_cnt')) || 0;
  setCookie('login_cnt', count + 1, 1);
}

function logout_count() {
  let count = parseInt(getCookie('logout_cnt')) || 0;
  setCookie('logout_cnt', count + 1, 1);
}

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

  if (sanitizedEmail.length < 5) {
    alert('아이디는 최소 5글자 이상 입력해야 합니다.');
    return false;
  }
  if (sanitizedPassword.length < 12) {
    alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
    return false;
  }

  if (sanitizedEmail.length > 10) {
    alert('이메일은 최대 10글자까지 입력 가능합니다.');
    return false;
  }
  if (sanitizedPassword.length > 15) {
    alert('비밀번호는 최대 15글자까지 입력 가능합니다.');
    return false;
  }

  const repeat3Pattern = /(.{3,})\1+/;
  if (repeat3Pattern.test(sanitizedEmail) || repeat3Pattern.test(sanitizedPassword)) {
    alert('3글자 이상 반복되는 패턴은 사용할 수 없습니다.');
    return false;
  }

  const repeat2DigitPattern = /(\d{2})\1+/;
  if (repeat2DigitPattern.test(sanitizedEmail) || repeat2DigitPattern.test(sanitizedPassword)) {
    alert('연속된 숫자 2개 이상 반복되는 입력은 허용되지 않습니다.');
    return false;
  }

  const hasSpecialChar = sanitizedPassword.match(/[!,.@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
  if (!hasSpecialChar) {
    alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
    return false;
  }

  const hasUpperCase = sanitizedPassword.match(/[A-Z]+/) !== null;
  const hasLowerCase = sanitizedPassword.match(/[a-z]+/) !== null;
  if (!hasUpperCase || !hasLowerCase) {
    alert('패스워드는 대소문자를 각각 1개 이상 포함해야 합니다.');
    return false;
  }

  if (idSaveCheck.checked) {
    setCookie('id', sanitizedEmail, 7);
  } else {
    setCookie('id', '', 0);
  }

  const payload = {
    id: sanitizedEmail,
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  const jwtToken = generateJWT(payload);
  localStorage.setItem('jwt_token', jwtToken);

  await session_set();
  login_count();
  setCookie('login_failed_cnt', '', 0);

  setTimeout(() => {
    loginForm.submit();
  }, 50);
};

function logout() {
  session_del();
  localStorage.removeItem('jwt_token');
  logout_count();
  location.href = '../index.html';
}

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

window.onload = function () {
  init();
};

const loginButton = document.getElementById("login_btn");
if (loginButton) {
  loginButton.addEventListener('click', check_input);
}
