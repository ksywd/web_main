const JWT_SECRET = "your_secret_key_here"; // 실제 서비스에서는 더 복잡한 키로 변경할 것

// JWT 토큰 생성
function generateJWT(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
  const encodedSignature = CryptoJS.enc.Base64.stringify(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

// JWT 토큰 검증
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

// 로그인 여부 확인
function isAuthenticated() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return false;

  const payload = verifyJWT(token);
  return !!payload;
}

// 인증 여부에 따라 페이지 접근 제한
function checkAuth() {
  const currentPage = window.location.pathname;

  // 로그인 페이지에서는 인증 검사 스킵
  if (currentPage.includes("login.html")) return;

  const authenticated = isAuthenticated();
  if (authenticated) {
    alert("정상적으로 토큰이 검증되었습니다.");
  } else {
    alert("토큰 검증 에러!! 인증되지 않은 접근입니다.");
    window.location.href = "../login/login.html";
  }
}

// 페이지 로드 시 인증 검사 실행
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

export { generateJWT, verifyJWT, isAuthenticated, checkAuth };
