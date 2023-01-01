var shopeeluckydrawUrl = {
  url: "https://games.shopee.vn/luckydraw/api/v1/lucky/event/a3267155f3ec89c2",
  headers: {
    Cookie: $persistentStore.read("CookieSP"),
  },
  body: {
    request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
    app_id: "E9VFyxwmtgjnCR8uhL",
    activity_code: "e37b7dec5976a29c",
    source: 0,
  },
};

$httpClient.post(shopeeluckydrawUrl, function (error, response, data) {
  if (error) {
    $notification.post("🍤 Shopee Kho báu tiền xu", "", "Lỗi kết nối‼️");
    $done();
  } else {
    if (response.status == 200) {
      let obj = JSON.parse(data);
      if (obj["msg"] == "no chance") {
        $notification.post("🍤 Hôm nay đã nhận được kho báu tiền xu", "", "Chỉ có thể đăng nhập một ngày một lần‼️");
        $done();
      } else if (obj["msg"] == "success") {
        var packagename = obj["data"]["package_name"];
        $notification.post(
          "🍤 Đã nhận được kho báu tiền xu ✅",
          "",
          "được 👉 " + packagename + " 💎"
        );
        $done();
      } else if (obj["msg"] == "expired" || obj["msg"] == "event already end") {
        $notification.post(
          "🍤 Sự kiện kho báu tiền xu hết hạn ❌",
          "",
          "Vui lòng chờ ，hẹn lại ngày mai‼️"
        );
        $done();
      }
      $done();
    } else {
      $notification.post("🍤 Shopee Cookie Hết hạn‼️", "", "Vui lòng đăng nhập lại 🔓");
      $done();
    }
  }
});
