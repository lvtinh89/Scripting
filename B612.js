/******************************

脚本功能：B612解锁VIP
下载地址：https://apps.apple.com/us/app/b612-ai-photo-video-editor/id904209370
软件版本：13.1.15 BOBO Premium
验证时间：2025-08-01

*******************************

[rewrite_local]
# > B612解锁VIP
^https:\/\/user-b612-api\.snow\.me\/v1\/purchase\/subscription\/subscriber\/status url script-response-body https://raw.githubusercontent.com/89996462/Quantumult-X/main/ycdz/bj.js

[mitm]
hostname = user-b612-api.snow.me

*******************************/

var body = $response.body;
var aleoo = JSON.parse(body);

aleoo = {
  "result": {
    "activated": true,
    "products": [{
      "productId": "com.campmobile.snowcamera.vip.oneyear",
      "startDate": 1735689600000,
      "expireDate": 4070908800,
      "managed": false,
      "status": "ACTIVE"
    }]
  }
};

body = JSON.stringify(aleoo);
$done({ body });
