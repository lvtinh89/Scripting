/******************************

脚本功能：flighty解锁会员

*******************************

[rewrite_local]

[rewrite_local]
^https:\/\/api\.flightyapp\.com\/v1\/sync\/full url script-response-body https://github.com/Asiru0/in_app_purchase/raw/refs/heads/main/flighty.js

[mitm] 

hostname = api.flightyapp.com

*******************************/

// 简单的二进制替换测试
let body = $response.body;
let hex = Array.from(new Uint8Array(body))
               .map(b => b.toString(16).padStart(2, '0'))
               .join('');

// 尝试将 WEEKLY (5745454b4c59) 替换为 ANNUAL (414e4e55414c)
// 注意：两者长度必须相等，否则会崩溃
if (hex.indexOf('5745454b4c59') !== -1) {
    console.log("找到 WEEKLY，尝试替换为 ANNUAL...");
    hex = hex.replace('5745454b4c59', '414e4e55414c');
}

// 将修改后的 Hex 转回 ArrayBuffer
let newBody = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
$done({ body: newBody.buffer });
