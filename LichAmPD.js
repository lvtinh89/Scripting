/*
Surge: 
[Script]
LichAmPD = type=http-response,pattern=^https:\/\/menscoach-api\.asqq\.io\/prod\/user$,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/lvtinh89/Scripting/master/LichAmPD.js


MITM: g.doubleclick.net
*/


const url = $request.url;
let block = /com\.gearup\.booster|com\.quvideo\.XiaoYing|com\.danhhuynh\.inlove|lichviet|vn\.dica\.giainhanh|kiwi\.vpn/
if(block.test(url)){
body = {};
$done({response: {body, status: 200}});
}else{
$done({});
}