const JWT_SECRET = "your_secret_key_here"; // 보안을 위해 실제 배포시엔 복잡한 키 사용 권장

function generateJWT(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
  const encodedSignature = CryptoJS.enc.Base64.stringify(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
    const calculatedSignature = CryptoJS.enc.Base64.stringify(signature);
    if (calculatedSignature !== encodedSignature) return null;

    const payload = JSON.parse(atob(encodedPayload));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch (error) {
    return null;
  }
}

function isAuthenticated() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return false;
  const payload = verifyJWT(token);
  return !!payload;
}

function checkAuth() {
  const currentPage = window.location.pathname;

  // login.html에서는 checkAuth 실행 안함
  if (currentPage.includes("login.html")) return;

  const authenticated = isAuthenticated();
  if (authenticated) {
    alert("정상적으로 토큰이 검증되었습니다.");
  } else {
    alert("토큰 검증 에러!! 인증되지 않은 접근입니다.");
    window.location.href = "../login/login.html";
  }
}


document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

export { generateJWT, verifyJWT, isAuthenticated, checkAuth };
