const aesGcmKey = window.crypto.subtle;

// AES-GCM 방식으로 문자열 암호화
async function encryptGCM(plainText, keyStr) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12바이트 IV 생성

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyStr.padEnd(32)), // 32바이트 키
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(plainText)
  );

  const encryptedBytes = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.byteLength + encryptedBytes.byteLength); // IV + 암호문 결합
  combined.set(iv);
  combined.set(encryptedBytes, iv.byteLength);

  return btoa(String.fromCharCode(...combined)); // base64 인코딩 반환
}

// AES-GCM 방식 복호화 (base64 문자열 입력)
async function decryptGCM(base64Text, keyStr) {
  const data = Uint8Array.from(atob(base64Text), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const encryptedBytes = data.slice(12);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyStr.padEnd(32)),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encryptedBytes
  );

  return new TextDecoder().decode(decrypted);
}
