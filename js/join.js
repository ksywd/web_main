function join() {
    const nameRegex = /^[가-힣]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    let form = document.querySelector("#join_form");
    let name = document.querySelector("#form3Example1c");
    let email = document.querySelector("#form3Example3c");
    let password = document.querySelector("#form3Example4c");
    let re_password = document.querySelector("#form3Example4cd");
    let agree = document.querySelector("#form2Example3c");

    form.action = "../index.html";
    form.method = "get";

    // 필수 입력값 체크
    if (
        name.value.length === 0 || 
        email.value.length === 0 || 
        password.value.length === 0 || 
        re_password.value.length === 0
    ) {
        alert("회원가입 폼에 모든 정보를 입력해주세요.");
        return;
    }

    // 이름 한글 검증
    if (!nameRegex.test(name.value)) {
        alert("이름은 한글만 입력 가능합니다.");
        name.focus();
        return;
    }

    // 이메일 형식 검증
    if (!emailRegex.test(email.value)) {
        alert("이메일 형식이 올바르지 않습니다.");
        email.focus();
        return;
    }

    // 비밀번호 강도 검증
    if (!pwRegex.test(password.value)) {
        alert("비밀번호는 대소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.");
        password.focus();
        return;
    }

    // 비밀번호 일치 여부 확인
    if (password.value !== re_password.value) {
        alert("비밀번호가 일치하지 않습니다.");
        re_password.focus();
        return;
    }

    // 약관 동의 여부 확인
    if (!agree.checked) {
        alert("약관에 동의해야 회원가입이 가능합니다.");
        agree.focus();
        return;
    }

    // 회원 정보 세션 저장 후 폼 제출
    const newSignUp = new SignUp(name.value, email.value, password.value, re_password.value);
    session_set2(newSignUp);
    form.submit();
}
