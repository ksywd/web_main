// AES256 방식으로 암호화 (key, data 사용)
function encodeByAES256(key, data) {
  const cipher = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(""),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }
  );
  return cipher.toString();
}

// AES256 방식으로 복호화 (key, 암호화된 data 사용)
function decodeByAES256(key, data) {
  const cipher = CryptoJS.AES.decrypt(
    data,
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(""),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }
  );
  return cipher.toString(CryptoJS.enc.Utf8);
}

// 고정 키/IV를 사용한 암호화 함수 (session 저장용 등)
function encrypt_text(password) {
  const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012"); // 32바이트 키
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16바이트 IV

  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  return encrypted.toString();
}

// 세션에서 암호문 가져와 복호화 (디버깅용 로그 출력)
function decrypt_text() {
  const en_text = sessionStorage.getItem("Session_Storage_pass");
  const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

  const decrypted = CryptoJS.AES.decrypt(en_text, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  console.log("복호화된 비밀번호: ", decrypted.toString(CryptoJS.enc.Utf8));
}

export { encrypt_text, decrypt_text };
