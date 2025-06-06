// ✅ session.js
import { encrypt_text } from './crypto.js';

// 로그인 시 세션에 데이터 저장
export async function session_set() {
  let id = document.querySelector("#typeEmailX");
  let password = document.querySelector("#typePasswordX");
  let random = new Date(); // 타임스탬프 역할

  const obj = {
    id: id.value,
    otp: random
  };

  if (sessionStorage) {
    const objString = JSON.stringify(obj);
    const en_text = await encrypt_text(objString); // AES256 암호화

    sessionStorage.setItem("Session_Storage_id", id.value);
    sessionStorage.setItem("Session_Storage_object", objString);
    sessionStorage.setItem("Session_Storage_pass", en_text);

    // AES-GCM 방식으로 비밀번호도 따로 암호화
    encryptGCM(password.value, "my_secure_key").then((encryptedGCM) => {
      sessionStorage.setItem("Session_Storage_pass2", encryptedGCM);
    });
  } else {
    alert("세션 스토리지 지원 x");
  }
}

// 암호화된 비밀번호 세션에서 가져오기
export function session_get() {
  if (sessionStorage) {
    return sessionStorage.getItem("Session_Storage_pass");
  } else {
    alert("세션 스토리지 지원 x");
  }
}

// 로그인 상태면 특정 페이지로 강제 이동
export function session_check() {
  if (sessionStorage.getItem("Session_Storage_id")) {
    const currentPage = location.pathname;
    if (!currentPage.includes("index_login.html")) {
      console.log("이미 로그인 상태입니다.");
      location.href = './login/index_login.html';
    }
  }
}

// 로그아웃 처리
export function session_del() {
  if (sessionStorage) {
    sessionStorage.clear();
    alert("로그아웃 처리되었습니다.");
  } else {
    alert("세션 스토리지 지원 x");
  }
}

// 회원가입 시 세션에 데이터 저장
export async function session_set2(signUpObj) {
  if (sessionStorage) {
    const json = JSON.stringify(signUpObj);
    const encrypted = await encrypt_text(json); // 회원가입 정보 암호화
    sessionStorage.setItem("Session_Storage_newJoin", encrypted);
    sessionStorage.setItem("IsThisFirstTime_Log_From_LiveServer", true);
  } else {
    alert("세션 스토리지 지원 x");
  }
}

// 로그인하지 않은 사용자는 로그인 페이지로 이동
export function session_check_redirectToLogin() {
  const loginData = sessionStorage.getItem("Session_Storage_pass");
  if (!loginData) {
    alert("로그인이 필요합니다.");
    location.href = "../index.html";
  }
}
