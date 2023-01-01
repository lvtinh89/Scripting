var shopeeUrl = {
    url: 'https://shopee.vn/mkt/coins/api/v2/checkin',
    headers: {
      Cookie: $persistentStore.read("CookieSP"),
    }
  }
$httpClient.post(shopeeUrl, function(error, response, data){
  if (error) {
    $notification.post("🍤 Đăng nhập Shopee", "", "Lỗi kết nối‼️")
    $done(); 
  } 
  else{
  if(response.status == 200)
  {
    let obj= JSON.parse(data);
    if(obj["data"]["success"])
    {
      var user = obj["data"]["username"];
      var coins = obj["data"]["increase_coins"];
      var checkinday = obj["data"]["check_in_day"];
      $notification.post("🍤 Shopee Mua sắm " + user, "Checkin liên tiếp " + checkinday + " Hôm nay ✅", "Được 👉 " + coins + " Đồng xu 💰");
      $done();
    }
    else if(obj["data"]["success"] == false)
    {
      $notification.post("🍤 Shopee đã đăng nhập，Chỉ có thể đăng nhập một ngày một lần‼️", "", "");
      $done();
    }
  $done();
  }
else{
  $notification.post("🍤 Shopee Cookie Hết hạn‼️", "", "Đăng nhập lại thông tin 🔓");
  $done();
  }
  }
});
