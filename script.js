

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

//テストのピンを立てる
const kashiwanohaSnails = [
  [35.8952233, 139.9390314],
  [35.8975289, 139.9378465],
  [35.8971427, 139.9373627],
  [35.8965583, 139.9368843],
  [35.8965088, 139.9360448],
  [35.8963307, 139.9354373],
  [35.8956552, 139.9356314],
  [35.8952964, 139.9358074],
  [35.8948719, 139.9362087],
  [35.8937368, 139.9364173],
  [35.8940859, 139.9367150],
  [35.8943241, 139.9387934],
  [35.8939797, 139.9398250],
  [35.8939354, 139.9412758],
  [35.8942407, 139.9413549],
  [35.894581465777094, 139.94256016029982],
  [35.89083674818491, 139.94446556746075],
  [35.889537065578565, 139.94110507827074],
  [35.889860648288966, 139.93935108077753],
  [35.890550021909284, 139.93954017624122],
  [35.89033607901349, 139.94081494038466],
  [35.89102280724692, 139.9408573238465],
  [35.89122354207632, 139.9397227512163],
  [35.89187592673266, 139.9399151069266],
  [35.89177027776258, 139.94123551471878],
  [35.89216646067639, 139.941193131265],
  [35.89306149905366, 139.93557169444256],
  [35.893685344184966, 139.93442252423],
  [35.89736856550489, 139.9325427702815],
  [35.898362638816614, 139.93251861369163],
  [35.89869138473495, 139.93415643048394],
  [35.90070389064486, 139.9389959342185],
  [35.898746333155735, 139.94045672206468],
  [35.89471223557179, 139.9424929328779]
  
]

for(let i=1;i<kashiwanohaSnails.length;i++){
  console.log(kashiwanohaSnails[i])
  L.polyline([[kashiwanohaSnails[i-1][0], kashiwanohaSnails[i-1][1]], [kashiwanohaSnails[i][0], kashiwanohaSnails[i][1]]], { "color": "green", "weight": 10, "opacity": 0.5 }).addTo(map);
}

L.polyline([[cp.lat, cp.lng], [pp.lat, pp.lng]], { "color": "green", "weight": 10, "opacity": 0.5 }).addTo(map);

