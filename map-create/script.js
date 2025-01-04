
//-----script

//作っているルート
let route = []
let routeLine

//旗データの配列
let flagsLocation = []

//自分の座標管理
let myLocusLine = [];

//歩いている状態管理
let isWalking = false;

let wp //watchPositionを格納する

// 位置情報 オプション・パラメータをセット
var position_options = {
  // 高精度を要求する
  enableHighAccuracy: true,
  // 最大待ち時間（ミリ秒）
  timeout: 60000,
  // キャッシュ有効期間（ミリ秒）
  maximumAge: 0
};

//モードのオンオフ
$("#walkStart").on("click", function() {
  isWalking = !isWalking
  $('#walkStart').text('Stop');

  if(isWalking == true){ //ハンドラーを登録
    wp = navigator.geolocation.watchPosition(monitor, fail, position_options)
  } else { //ハンドラー登録を解除
    navigator.geolocation.clearWatch(wp)
  }

})

//map描画設定
const map = L.map('map').setView([35.6895, 139.6917], 13); // 緯度と経度、ズームレベルを設定

//センタークロス画像読み込み
var crossIcon = L.icon({
  iconUrl: 'https://www.achiachi.net/blog/_outside/mapicon/gmap_cross.gif',
  //↑センタークロス画像のURL
  iconSize: [32, 32],  //アイコン表示サイズ(画像サイズと違えば拡大縮小されます)
  iconAnchor: [16, 16], //十字の中心位置を指定、0,0にするとアイコンの左上がセンターに表示されます
  maxZoom: 20
});

//センタークロス追加
var crossMarker = L.marker( map.getCenter(),{
  icon:crossIcon,    //アイコン画像を指定
  zIndexOffset:1000, //センタークロスを他のマーカーより上側表示します。
                     //マーカーが多数ある場合はより大きな値を指定して下さい10000など
  interactive:false  //センタークロスのクリックイベントを下側のマーカーに通過させます
}).addTo(map);

//センタークロスの場所の初期値
outputPos(map); 

//マップ動いたときにセンタークロスも動かすそして取得
map.on('move', function(e) {
  crossMarker.setLatLng(map.getCenter());
  
  outputPos(map); 

});


// タイルを追加
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


function fail(pos) {
  alert('位置情報の取得に失敗しました。エラーコード：');
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


    // 線をつなぐ

    const pp = myLocusLine.slice(-2)[0] //pastPosition
    const cp = myLocusLine.slice(-1)[0] //currentPosition

    L.polyline([[cp.lat, cp.lng], [pp.lat, pp.lng]], { "color": "green", "weight": 10, "opacity": 0.5 }).addTo(map);




  }
}


//現在の緯度・経度・倍率を取得して指定の要素に情報を出力する関数
function outputPos(map){
  var pos = getCenterPos()
  //spanに出力
  $("#aroundPos .lat").html(pos.lat)
  $("#aroundPos .lng").html(pos.lng)
  $("#aroundPos .zoom").html(pos.zoom)

  
}

function getCenterPos(){
  var pos = map.getCenter();
  var zoom = map.getZoom();
  let out = {}
  
  out.lat = pos.lat
  out.lng = pos.lng
  out.zoom = zoom
  return out
}

//周囲のデータ取得
$('#getAround').on('click', function() {
  
  devAround()

});

//【開発用】マップに周囲のデータを表示する
// 配列：flagsLocation
async function devAround(){
  //ポイントのリスト削除
  for (const e of flagsLocation){
    map.removeLayer(e);
  }
  flagsLocation = []

  //マップに表示
  const pos = getCenterPos()
  const data = await getapiAround(pos.lat,pos.lng)
  
  for (const e of data.elements){
    if(e.type == 'node'){ //nodeのみ表示
      flagsLocation.push(L.marker([e.lat, e.lon]).bindPopup(JSON.stringify(e,null,'\t')+"<br><button onclick='routeAdd("+JSON.stringify(e,null,'\t')+")'>追加する</button>").addTo(map))
    }
  }

}


async function getapiAround(lat,lon){
  const radius = 10 //半径メートル
  // lat = 35.89066680515657
  // lon = 139.94405240019375
  const overpassQuery = encodeURI('[out:json];(way["highway"](around:'+radius+','+lat+','+lon+'););out body;>;out skel;');
  const url = "http://overpass-api.de/api/interpreter?data="+overpassQuery
  const res = await fetch(url,{
    headers:{
      "User-Agent":"mapart"
    }
  });
  const out = await res.json()
  return out;
}
//[out:json];(way["highway"](around:3,35.89066680515657,139.94405240019375););out body;>;out skel;


//ルート追加
function routeAdd(data){
  route.push(data)
  routeShow()
}
window.routeAdd = routeAdd;

function routeShow(){
  $("#routeDetail").text("")//表示リセット
  if(routeLine!=null){routeLine.remove()}

  let routeLineLocation = []
  for(const r of route){

    //削除ボタン
    let e1 = $("<button>")
    e1.text("削除")
    e1.on("click",function(){ //削除
      route = routeDel(r.id)
      routeShow()
    })

    

    let e2 = $("<span>")
    e2.text(r.id)

    let e = $("<div>")

    e.append(e1)
    e.append(e2)

    $("#routeDetail").append(e)

    
    //map表示用に配列を追加
    routeLineLocation.push([r.lat,r.lon])
    console.log(routeLineLocation)

    
  }

  //mapに線を表示
  routeLine = L.polyline(routeLineLocation,{
    color: 'blue',      // 線の色
    weight: 8,          // 線の太さ
    opacity: 0.7       // 線の透明度
  }).addTo(map);

  //developer用表示
  $("#routeOut").text(JSON.stringify(route,null,'\t'))
}


function routeDel(id){
  const newArray= route.filter(function(item){
    return item.id != id
  });
  return newArray
}