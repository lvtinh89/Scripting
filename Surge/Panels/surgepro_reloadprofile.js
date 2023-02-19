let params = getParams($argument)

!(async () => {
/* Thời gian mua lại */
let traffic = (await httpAPI("/v1/traffic","GET"))
let dateNow = new Date()
let dateTime = Math.floor(traffic.startTime*1000)
let startTime = timeTransform(dateNow,dateTime)

if ($trigger == "button") await httpAPI("/v1/profiles/reload");

  $done({
      title:"Surge Pro",
      content:`Thời gian khởi động: ${startTime}`,
		icon: params.icon,
		"icon-color":params.color
    });

})();

function timeTransform(dateNow,dateTime) {
let dateDiff = dateNow - dateTime;
let days = Math.floor(dateDiff / (24 * 3600 * 1000));//Tính toán sự khác biệt trong ngày
let leave1=dateDiff%(24*3600*1000)    //Số mili giây còn lại sau khi tính số ngày
let hours=Math.floor(leave1/(3600*1000))//Tính giờ
//Tính toán sự khác biệt trong vài phút
let leave2=leave1%(3600*1000)    //Mili giây còn lại sau khi đếm giờ
let minutes=Math.floor(leave2/(60*1000))//Tính toán sự khác biệt trong vài phút
//Tính toán sự khác biệt trong vài giây
let leave3=leave2%(60*1000)      //Tính số mili giây còn lại sau số phút
let seconds=Math.round(leave3/1000)

if(days==0){

	if(hours==0){
	if(minutes==0)return(` ${seconds}Giây`);
	return(` ${minutes}Phút ${seconds}Giây`)
	}
	return(`${hours}Giờ ${minutes}Phút ${seconds}Giây`)
	}else {
	return(`${days}Ngày ${hours}Giờ ${minutes}Phút`)
	}

}


function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}

function getParams(param) {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}
