

//-----script


//友達の現在地
let globalLocations = {};

//歩いている状態管理
let isWalking = false;

var watchID;

// オプション・パラメータをセット
const position_options = {
  // 高精度を要求する
  enableHighAccuracy: true,
  // 最大待ち時間（ミリ秒）
  timeout: 60000,
  // キャッシュ有効期間（ミリ秒）
  maximumAge: 0
};



//map描画設定
const map = L.map('map').setView([35.6895, 139.6917], 13); // 緯度と経度、ズームレベルを設定

let myLocusLine = [];//自分の軌跡データ

//キャンパス駅を指す
const marker = L.marker([35.89331402344927, 139.95260380597148]).addTo(map);
marker.bindPopup('柏の葉キャンパス駅').openPopup();

// タイルを追加
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// マーカーを追加


// 位置情報取得
function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const accuracy = pos.coords.accuracy;

  //$('#loc').text(`緯度：${lat} 経度：${lng}`);
  //$('#accuracy').text(accuracy);

  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup('ここはあなたの場所。').openPopup();

}

function fail(error) {
  alert('位置情報の取得に失敗しました。エラーコード：' + error.code);
}

//navigator.geolocation.getCurrentPosition(success, fail);


document.addEventListener("DOMContentLoaded", function() {


}, false);

// 位置情報取得完了時の処理
function monitor(event) {
  // 緯度
  var latitude = event.coords.latitude;
  // 経度
  var longitude = event.coords.longitude;
  // 緯度・経度の精度
  var accuracy = event.coords.accuracy;
  // GPS 高度
  var altitude = event.coords.altitude;
  // GPS 高度の精度
  var altitudeAccuracy = event.coords.altitudeAccuracy;
  // 移動方向
  var heading = event.coords.heading;
  // 移動速度
  var speed = event.coords.speed;
  // タイムスタンプ
  var date = event.timestamp;
  if (typeof (date) == "number") {
    date = new Date(date);
  }

  $("#realtime").html(String(latitude) + String(longitude) + String(date) + " 精度:" + String(accuracy))//表示




  //const marker = L.marker([latitude, longitude]).addTo(map);
  //marker.bindPopup('ここはあなたの場所。').openPopup();





  if (isWalking == true) {
    myLocusLine.push({ "lat": latitude, "lng": longitude })

    const pp = myLocusLine.slice(-2)[0] //pastPosition
    const cp = myLocusLine.slice(-1)[0] //currentPosition


    L.polyline([[cp.lat, cp.lng], [pp.lat, pp.lng]], { "color": "green", "weight": 10, "opacity": 0.5 }).addTo(map);

    console.log(myLocusLine)
  }
}


$("#walkStart").on("click", function() {
  isWalking = !isWalking
  console.log(isWalking)
  if (isWalking == true) {

    //初期位置情報
    $('#walkStart #start').text('Stop');
    navigator.geolocation.getCurrentPosition(monitor, fail, position_options);
    console.log("位置情報on&取得")

    // 継続的に位置情報を取得
    watchID = navigator.geolocation.watchPosition(monitor, fail, position_options);

  } else {
    $('#walkStart #start').text('Start');
    navigator.geolocation.clearWatch(watchID);
  }
})


// $(function() {
//   let json = './friendPosition.json';
//   $.getJSON(json, function(data) {
//     const addLoc = data["aaaaaaaaaa"]
//     console.log(Object.keys(addLoc).length)
//     for (let i = 1; i<Object.keys(addLoc).length-1; i++) {
//       L.polyline([[cp.lat, cp.lng], [pp.lat, pp.lng]], { "color": "green", "weight": 10, "opacity": 0.5 }).addTo(map);
//     }
//   });
// });
//L.polyline([[cp.lat, cp.lng], [pp.lat, pp.lng]], { "color": "green", "weight": 10, "opacity": 0.5 }).addTo(map);

