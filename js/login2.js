import { decrypt_text } from './crypto.js';
import { session_check } from './session.js';
import { checkAuth } from './jwt_token.js';

function init_logined() {
  if (sessionStorage) {
    decrypt_text(); // AES256 복호화

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

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  init_logined();

  if (sessionStorage) {
    const encryptedJoin = sessionStorage.getItem("Session_Storage_newJoin");
    if (encryptedJoin) {
      decrypt_text(encryptedJoin).then((decrypted) => {
        console.log("복호화된 회원가입 객체:", decrypted);
      });
    }
  }
});