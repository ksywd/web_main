// 지도 영역을 담을 컨테이너 지정
const container = document.getElementById('map');

// 지도의 중심 좌표와 확대 레벨 설정 (성결대학교 위치)
const options = {
  center: new kakao.maps.LatLng(37.379485, 126.928174),
  level: 3
};

// 지도 생성
const map = new kakao.maps.Map(container, options);

// 주소 변환을 위한 Geocoder 객체 생성
const geocoder = new kakao.maps.services.Geocoder();

// 초기 마커 생성 및 지도에 표시
const marker = new kakao.maps.Marker({ position: options.center });
marker.setMap(map);

// 지도 클릭 시 좌표 및 주소 표시
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
  const latlng = mouseEvent.latLng;

  // 마커 위치 이동
  marker.setPosition(latlng);

  // 클릭한 좌표 출력
  const resultDiv = document.getElementById('clickLatlng');
  resultDiv.innerHTML = `위도: ${latlng.getLat()}, 경도: ${latlng.getLng()}`;

  // 클릭한 좌표의 주소 가져오기
  geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const address = result[0].address.address_name;
      const addrDiv = document.getElementById('addressResult');
      addrDiv.innerHTML = `<b>주소:</b> ${address}`;
    }
  });
});

// 지도 타입(일반/스카이뷰 등) 컨트롤 추가
const mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 줌 컨트롤 추가
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 지형 정보 레이어 추가
map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);

// 장소 검색 관련 변수
const markers = [];
const ps = new kakao.maps.services.Places();
const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 기본 검색 실행 (성결대학교 기준)
function searchPlaces() {
  const keyword = '성결대학교';
  ps.keywordSearch(keyword, placesSearchCB);
}

// 검색 결과 처리 콜백
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    for (let i = 0; i < data.length; i++) {
      displayMarker(data[i]);
    }
  }
}

// 검색된 장소마다 마커 생성 및 클릭 이벤트 연결
function displayMarker(place) {
  const marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.y, place.x)
  });

  // 마커 클릭 시 인포윈도우 표시
  kakao.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(`<div style="padding:5px;font-size:12px;">${place.place_name}</div>`);
    infowindow.open(map, marker);
  });

  markers.push(marker);
}

// 검색 시작
searchPlaces();
