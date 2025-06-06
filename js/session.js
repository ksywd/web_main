import { encrypt_text } from './crypto.js';

export async function session_set() {
  let id = document.querySelector("#typeEmailX");
  let password = document.querySelector("#typePasswordX");
  let random = new Date(); // 타임스탬프

  const obj = {
    id: id.value,
    otp: random
  };

  if (sessionStorage) {
    const objString = JSON.stringify(obj); // 객체 → 문자열
    let en_text = await encrypt_text(objString); // 암호화
    sessionStorage.setItem("Session_Storage_id", id.value);
    sessionStorage.setItem("Session_Storage_object", objString);
    sessionStorage.setItem("Session_Storage_pass", en_text);

    encryptGCM(password.value, "my_secure_key").then((encryptedGCM) => {
      sessionStorage.setItem("Session_Storage_pass2", encryptedGCM);
    });
  } else {
    alert("세션 스토리지 지원 x");
  }
}


function session_get() {
  if (sessionStorage) {
    return sessionStorage.getItem("Session_Storage_pass");
  } else {
    alert("세션 스토리지 지원 x");
  }
}

function session_check() {
  if (sessionStorage.getItem("Session_Storage_id")) {
    const currentPage = location.pathname;
    if (!currentPage.includes("index_login.html")) {
      console.log("이미 로그인 상태입니다.");
      location.href = './login/index_login.html';
    }
  }
}

function session_del() {
  if (sessionStorage) {
    sessionStorage.removeItem("Session_Storage_test");
    alert("로그아웃 처리되었습니다.");
  } else {
    alert("세션 스토리지 지원 x");
  }
}

export async function session_set2(signUpObj) {
  if (sessionStorage) {
    const json = JSON.stringify(signUpObj); // 객체 → 문자열
    const encrypted = await encrypt_text(json); // 암호화
    sessionStorage.setItem("Session_Storage_newJoin", encrypted);
    sessionStorage.setItem("IsThisFirstTime_Log_From_LiveServer", true);
  } else {
    alert("세션 스토리지 지원 x");
  }
}

export { session_set, session_get, session_check, session_del };
