function encodeByAES256(key, data) {
    const cipher = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(key),
        {
            iv: CryptoJS.enc.Utf8.parse(""), // IV 초기화 벡터
            padding: CryptoJS.pad.Pkcs7,     // 패딩
            mode: CryptoJS.mode.CBC          // 운영 모드
        }
    );
    return cipher.toString();
}

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

function encrypt_text(password) {
  const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012"); // 32바이트
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16바이트

  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  return encrypted.toString();
}

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
