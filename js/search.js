// 검색 버튼이 존재하면 클릭 이벤트 등록
const searchBtn = document.getElementById("search_button_msg");
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    search_message();
    googleSearch();
  });
}

// 단순한 안내 메시지 출력
function search_message() {
  let msg = "검색을 수행합니다!";
  alert(msg);
}

// 구글 검색 처리
function googleSearch() {
  const searchInput = document.getElementById("search_input");
  if (!searchInput) {
    alert("검색 입력창이 존재하지 않습니다.");
    return false;
  }

  const searchTerm = searchInput.value.trim(); // 검색어 정리
  const banwords = ["티모", "베인", "마스터이", "야스오", "요네"]; // 금칙어 리스트

  if (searchTerm === "") {
    alert("검색어를 입력해주세요!");
    return false;
  }

  // 금칙어가 포함되어 있는지 검사
  for (let i = 0; i < banwords.length; i++) {
    if (searchTerm.includes(banwords[i])) {
      alert("부적절한 검색어가 포함되어 있습니다.");
      return false;
    }
  }

  // 구글 검색 창 새 탭으로 열기
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
  window.open(googleSearchUrl, "_blank");
  return false;
}
