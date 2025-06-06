import { decrypt_text } from './crypto.js';
import { session_check } from './session.js';
import { checkAuth } from './jwt_token.js';

// 로그인된 사용자의 GCM 비밀번호 복호화 처리
function init_logined() {
  if (sessionStorage) {
    decrypt_text(); // AES-256 복호화

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

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();      // JWT 토큰 검증
  init_logined();   // 로그인 사용자 정보 복호화

  if (sessionStorage) {
    const encryptedJoin = sessionStorage.getItem("Session_Storage_newJoin");
    if (encryptedJoin) {
      decrypt_text(encryptedJoin).then((decrypted) => {
        console.log("복호화된 회원가입 객체:", decrypted);
      });
    }
  }
});
