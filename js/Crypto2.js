const aesGcmKey = window.crypto.subtle;

async function encryptGCM(plainText, keyStr) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyStr.padEnd(32)),
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
  const combined = new Uint8Array(iv.byteLength + encryptedBytes.byteLength);
  combined.set(iv);
  combined.set(encryptedBytes, iv.byteLength);

  return btoa(String.fromCharCode(...combined));
}

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
