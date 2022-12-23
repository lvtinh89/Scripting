const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('đŸ¤ è¦å¹£å¯¶ç®±', subtitle, message, { 'url': 'shopeevn://' });
};

const luckyDrawBasicUrl = 'https://games.shopee.vn/luckydraw/api/v1/lucky/event/';
const eventListRequest = {
  url: 'https://mall.shopee.vn/api/v4/banner/batch_list',
  headers: shopeeHeaders,
  body: {
    'types': [{ 'type': 'coin_carousel' }, { 'type': 'coin_square' }]
  },
};

let coinLuckyRrawGetIdRequest = {
  url: '',
  headers: shopeeHeaders,
};

let coinLuckyRrawRequest = {
  url: '',
  headers: shopeeHeaders,
  body: {
    request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
    app_id: 'E9VFyxwmtgjnCR8uhL',
    activity_code: '',
    source: 0,
  },
};

function eventListGetActivity() {
  $httpClient.post(eventListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'ç„¡æ³•å–å¾—æ´»å‹•åˆ—è¡¨ â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
      $done();
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        // console.log(data)
        const bannerSets = obj.data.banners;
        let foundId = false;
        for (const bannerSet of bannerSets) {
          for (const banner of bannerSet.banners) {
            try {
              const title = banner.navigate_params.navbar.title;
              const url = banner.navigate_params.url;
              // console.log(title + ': ' + url);
              if (title.includes('è¦å¹£å¯¶ç®±') || title.includes('å¤©å¤©é ˜è¦å¹£')) {
                const re = /activity\/(.*)\?/i;
                let found = url.match(re);
                if (!found) {
                  const re = /activity\/(.*)/i;
                  found = url.match(re);
                }
                const activityId = found[1];
                foundId = true;
                console.log('æ´»å‹• ID:' + activityId);
                coinLuckyRrawGetIdRequest.url = 'https://games.shopee.vn/gameplatform/api/v1/game/activity/' + activityId + '/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false';
                coinLuckyRrawRequest.body.activity_code = activityId;
                coinLuckyDrawGetId();
              }
            }
            catch (error) {
              shopeeNotify(
                'ç„¡æ³•å–å¾—æ´»å‹•åˆ—è¡¨ â€¼ï¸',
                error
              );
              $done();
            }
          }
        }
        if (foundId === false) {
          console.log('æ‰¾ä¸åˆ°è¦å¹£å¯¶ç®±æ´»å‹•');
          $done();
        }
      } else {
        shopeeNotify(
          'Cookie å·²éæœŸ â€¼ï¸',
          'è«‹é‡æ–°ç™»å…¥'
        );
        $done();
      }
    }
  });
}

// ç²å¾—å¯¶ç®± ID
function coinLuckyDrawGetId() {
  $httpClient.get(coinLuckyRrawGetIdRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'ç¶²å€æŸ¥è©¢å¤±æ•— â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const eventUrl = obj.data.basic.event_code;;
            coinLuckyRrawRequest.url = luckyDrawBasicUrl + eventUrl;
            console.log('ç¶²å€æŸ¥è©¢æˆåŸï¼ ' + coinLuckyRrawRequest.url);
            // shopeeNotify(
            //   'ç¶²å€æŸ¥è©¢æˆåŸ đŸ”—',
            //   coinLuckyRrawRequest.url
            // );
            coinLuckyDraw();
          } else {
            shopeeNotify(
              'ç¶²å€æŸ¥è©¢å¤±æ•— â€¼ï¸',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          shopeeNotify(
            'ç¶²å€æŸ¥è©¢å¤±æ•— â€¼ï¸',
            error
          );
          $done();
        }
      } else {
        shopeeNotify(
          'Cookie å·²éæœŸ â€¼ï¸',
          'è«‹é‡æ–°ç™»å…¥'
        );
        $done();
      }
    }
  });
}

function coinLuckyDraw() {
  $httpClient.post(coinLuckyRrawRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'é ˜å–å¤±æ•— â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        if (obj.msg === 'success') {
          const packageName = obj.data.package_name;
          shopeeNotify(
            'é ˜å–æˆåŸ âœ…',
            'ç²å¾— đŸ‘‰ ' + packageName + ' đŸ’'
          );
        }
        else if (obj.msg === 'no chance') {
          shopeeNotify(
            'é ˜å–å¤±æ•— â€¼ï¸',
            'æ¯æ—¥åªèƒ½é ˜ä¸€æ¬¡'
          );
        } else if (obj.msg === 'expired' || obj.msg === 'event already end') {
          shopeeNotify(
            'é ˜å–å¤±æ•— â€¼ï¸',
            'æ´»å‹•å·²éæœŸă€‚è«‹å˜—è©¦æ›´æ–°æ¨¡çµ„æˆ–è…³æœ¬ï¼Œæˆ–ç­‰å¾…ä½œè€…æ›´æ–°'
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

eventListGetActivity();
