const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('đŸ¤ è¦ç®ç°½åˆ°', subtitle, message, { 'url': 'shopeevn://' });
};

const refershRequest = {
  url: 'https://mall.shopee.vn/api/v4/client/refresh',
  headers: {
    Cookie: 'shopee_token=' + $persistentStore.read('ShopeeToken') + ';'
  },
};

const accountInfoRequest = {
  url: 'https://shopee.vn/api/v2/user/account_info?from_wallet=false&skip_address=1&need_cart=1',
  headers: shopeeHeaders,
};

const checkinRequest = {
  url: 'https://shopee.vn/mkt/coins/api/v2/checkin',
  headers: shopeeHeaders,
};

function updateSPC_EC() {
  $httpClient.get(refershRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'SPC_EC ä¿å­˜å¤±æ•— â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
      $done();
    } else {
      if (response.status == 200) {
        const cookie = $persistentStore.write(response.headers['Set-Cookie'].split('SPC_EC=')[1].split(';')[0], 'SPC_EC');
        if (cookie) {
          // shopeeNotify(
          //   'SPC_EC ä¿å­˜æˆåŸ đŸ‰',
          //   ''
          // );
          updateCookie();
        } else {
          shopeeNotify(
            'SPC_EC ä¿å­˜å¤±æ•— â€¼ï¸',
            'è«‹é‡æ–°ç™»å…¥'
          );
          $done();
        }
      } else {
        shopeeNotify(
          'SPC_EC ä¿å­˜å¤±æ•— â€¼ï¸',
          'è«‹é‡æ–°ç™»å…¥'
        );
        $done();
      }
    }
  });
}

function updateCookie() {
  $httpClient.get(accountInfoRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'Cookie ä¿å­˜å¤±æ•— â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
      $done();
    } else {
      if (response.status == 200) {
        const cookie = $persistentStore.write(
          response.headers['Set-Cookie'],
          'CookieSP'
        );
        if (cookie) {
          checkin();
          // shopeeNotify(
          //   'Cookie æ›´æ–°æˆåŸ đŸª',
          //   ''
          // );
        } else {
          shopeeNotify(
            'Cookie ä¿å­˜å¤±æ•— â€¼ï¸',
            'è«‹é‡æ–°ç™»å…¥'
          );
          $done();
        }
      } else {
        shopeeNotify(
          'Cookie ä¿å­˜å¤±æ•— â€¼ï¸',
          'è«‹é‡æ–°ç™»å…¥'
        );
        $done();
      }
    }
  });
}

function checkin() {
  $httpClient.post(checkinRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'ç°½åˆ°å¤±æ•— â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
    } else {
      if (response.status === 200) {
        const obj = JSON.parse(data);
        if (obj.data.success) {
          const coins = obj.data.increase_coins;
          const checkInDay = obj.data.check_in_day;
          shopeeNotify(
            'ç°½åˆ°æˆåŸï¼Œç›®å‰å·²é€£çºŒç°½åˆ° ' + checkInDay + ' å¤©',
            'ä»æ—¥å·²é ˜å– ' + coins + 'đŸ’°đŸ’°đŸ’°'
          );
        } else {
          console.log('æœ¬æ—¥å·²ç°½åˆ° â€¼ï¸');
          shopeeNotify(
            'ç°½åˆ°å¤±æ•— â€¼ï¸',
            'æœ¬æ—¥å·²ç°½åˆ°'
          );
        }
      } else {
        shopeeNotify(
          'Cookie å·²éæœŸ â€¼ï¸',
          'è«‹é‡æ–°ç™»å…¥'
        );
      }
    }
    $done();
  });
}

updateSPC_EC();
