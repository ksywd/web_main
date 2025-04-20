document.getElementById("search_button_msg").addEventListener('click', search_message);
function search_message(){
    let msg = "검색을 수행합니다!"
    alert(msg);
}
function googleSearch() {
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정

    const banwords = ["티모","베인","마스터이","야스오","요네"]

    if (searchTerm.trim() === ""){
        alert("검색어를 입력해주세요!");
        return false;
    }

    for (let i = 0; i < banwords.length; i++){

    
        if(searchTerm.includes(banwords[i])){
            alert("부적절한 검색어가 포함되어 있습니다.");
            return false;
        }
    }
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    // 새 창에서 구글 검색을 수행
    window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기.
    return false;
    }