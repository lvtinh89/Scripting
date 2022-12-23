function shopeeNotify(subtitle = '', message = '') {
  $notification.post('đŸ¤ è¦ç® Cookie', subtitle, message, { 'url': 'shopeevn://' });
};

const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
if (cookie) {
  const shopee_token = cookie.split('shopee_token=')[1].split(';')[0];
  const SPC_EC = cookie.split('SPC_EC=')[1].split(';')[0];
  const cstfToken = cookie.split('csrftoken=')[1].split(';')[0];

  const saveCookie = $persistentStore.write(cookie, 'CookieSP');
  const saveToken = $persistentStore.write(shopee_token, 'ShopeeToken');
  const saveSPC_EC = $persistentStore.write(SPC_EC, 'SPC_EC');
  const saveCsrf = $persistentStore.write(cstfToken, 'CSRFTokenSP');

  if (!(saveCookie && saveToken && saveCsrf && saveSPC_EC)) {
    shopeeNotify(
      'ä¿å­˜å¤±æ•— â€¼ï¸',
      'è«‹ç¨å¾Œå˜—è©¦'
    );
  } else {
    shopeeNotify(
      'ä¿å­˜æˆåŸ đŸª',
      ''
    );
  }
} else {
  shopeeNotify(
    'ä¿å­˜å¤±æ•— â€¼ï¸',
    'è«‹é‡æ–°ç™»å…¥'
  );
}
$done({});
