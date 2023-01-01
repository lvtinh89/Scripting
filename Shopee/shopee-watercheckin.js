var nwtime = Math.floor(new Date().getTime());
let wurl = "https://games.shopee.vn/farm/api/task/action?t=" + nwtime;

var shopeewurl = {
  url: wurl,
  headers: {
    Cookie: $persistentStore.read("CookieSP"),
    "Content-Type": "application/json",
  },
  body: { actionKey: "act_Check_In" },
};

$httpClient.post(shopeewurl, function (error, response, data) {
  if (error) {
    $notification.post("🍤 Shopee Giọt nước", "", "Lỗi kết nối‼️");
    $done();
  } else {
    if (response.status == 200) {
      let obj = JSON.parse(data);
      if (obj["msg"] == "success") {
        $notification.post("🍤 Shopee Giọt nước", "", "Nhiệm vụ hoàn thành ✅");
        $done();
      } else if (obj["msg"] == "false") {
        $notification.post(
          "🍤 Hôm nay đã hoàn thành nhiệm vụ",
          "",
          "Chỉ có thể đăng nhập một ngày một lần‼️"
        );
        $done();
      }
      $done();
    } else {
      $notification.post(
        "🍤 Shopee Cookie Lỗi mạng hoặc hết hạn‼️",
        "",
        "Vui lòng đăng nhập lại Cookie Thử lại 🔓"
      );
      $done();
    }
  }
});
