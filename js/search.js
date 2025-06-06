const searchBtn = document.getElementById("search_button_msg");
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    search_message();
    googleSearch();
  });
}

function search_message() {
  let msg = "검색을 수행합니다!";
  alert(msg);
}

function googleSearch() {
  const searchInput = document.getElementById("search_input");
  if (!searchInput) {
    alert("검색 입력창이 존재하지 않습니다.");
    return false;
  }

  const searchTerm = searchInput.value.trim();
  const banwords = ["티모", "베인", "마스터이", "야스오", "요네"];

  if (searchTerm === "") {
    alert("검색어를 입력해주세요!");
    return false;
  }

  for (let i = 0; i < banwords.length; i++) {
    if (searchTerm.includes(banwords[i])) {
      alert("부적절한 검색어가 포함되어 있습니다.");
      return false;
    }
  }

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
  window.open(googleSearchUrl, "_blank");
  return false;
}
