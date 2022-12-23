const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('đŸ¤ è¦ç®å…é‹å¯¶ç®±', subtitle, message, { 'url': 'shopeevn://' });
};

const eventListRequest = {
  url: 'https://mall.shopee.vn/api/v4/banner/batch_list',
  headers: shopeeHeaders,
  body: {
    'types': [{ 'type': 'coin_carousel' }, { 'type': 'coin_square' }]
  }
};

const iframeListRequest = {
  url: 'https://mall.shopee.vn/api/v4/market_coin/get_iframe_list?region=TW&offset=0&limit=10',
  headers: shopeeHeaders,
};

let shippingLuckyRrawGetIdRequest = {
  url: '',
  headers: shopeeHeaders,
};

let shippingLuckyRrawGetDailyChanceRequest = {
  url: '',
  headers: shopeeHeaders,
}

let shippingLuckyRrawRequest = {
  url: '',
  headers: shopeeHeaders,
  body: {
    // schedule_ldc_id: 0,
    request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
    app_id: 'E9VFyxwmtgjnCR8uhL',
    activity_code: '4b68412121aa9650',
    source: 0,
  },
};

function eventListGetActivity() {
  $httpClient.post(eventListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'ç„¡æ³•ç²å¾— banner æ´»å‹•åˆ—è¡¨ â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
      $done();
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        let foundEvent = false;
        const bannerSets = obj.data.banners;
        for (const bannerSet of bannerSets) {
          for (const banner of bannerSet.banners) {
            try {
              const title = banner.navigate_params.navbar.title;
              const url = banner.navigate_params.url;
              // console.log(title + ': ' + url);
              if (title.includes('æ½å…é‹åˆ¸')) {
                foundEvent = true;
                const re = /activity\/(.*)\?/i;
                let found = url.match(re);
                if (!found) {
                  const re = /activity\/(.*)/i;
                  found = url.match(re);
                }
                if (!found) {
                  const re = /activity=(.*)&/i;
                  found = url.match(re);
                }
                const activityId = found[1];
                console.log('åœ¨ banner æ‰¾åˆ°æ´»å‹• ID:' + activityId);
                shippingLuckyRrawGetIdRequest.url = 'https://games.shopee.vn/gameplatform/api/v1/game/activity/' + activityId + '/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false';
                shippingLuckyRrawRequest.body.activity_code = activityId;
                shippingLuckyDrawGetId();
              }
            }
            catch (error) {
              shopeeNotify(
                'ç„¡æ³•ç²å¾— banner æ´»å‹•åˆ—è¡¨ â€¼ï¸',
                error
              );
              $done();
            }
          }
        }
        if (!foundEvent) {
          console.log('åœ¨ banner æ‰¾ä¸åˆ°å…é‹å¯¶ç®±æ´»å‹•ï¼Œç¹¼çºŒå˜—è©¦æœå°‹ iframe');
          iframeListGetActivity();
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

function iframeListGetActivity() {
  $httpClient.get(iframeListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'ç„¡æ³•ç²å¾— iframe æ´»å‹•åˆ—è¡¨ â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
      $done();
    } else {
      if (response.status === 200) {
        const obj = JSON.parse(data);
        let foundEvent = false;
        const iframeList = obj.data.iframe_list;
        for (const iframe of iframeList) {
          console.log(iframe.title + ': ' + iframe.url);
          if ((iframe.title.includes('å…é‹') || iframe.title.includes('--æ´»å‹•åç¨±--')) && iframe.url.includes('luckydraw')) {
            foundEvent = true;
            const re = /activity\/(.*)\?/i;
            let found = iframe.url.match(re);
            if (!found) {
              const re = /activity\/(.*)/i;
              found = iframe.url.match(re);
            }
            if (!found) {
              const re = /activity=(.*)&/i;
              found = iframe.url.match(re);
            }
            const activityId = found[1];
            // console.log('åœ¨ iframe æ‰¾åˆ°æ´»å‹• ID:' + activityId);
            shippingLuckyRrawGetIdRequest.url = 'https://games.shopee.vn/gameplatform/api/v1/game/activity/' + activityId + '/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false';
            shippingLuckyRrawRequest.body.activity_code = activityId;
            shippingLuckyDrawGetId();
          }
        }
        if (!foundEvent) {
          console.log('åœ¨ iframe æ‰¾ä¸åˆ°å…é‹å¯¶ç®±æ´»å‹•ï¼ŒçµæŸ');
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

// ç²å¾—å…é‹å¯¶ç®± ID
function shippingLuckyDrawGetId() {
  $httpClient.get(shippingLuckyRrawGetIdRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'å¯¶ç®±ç¶²å€æŸ¥è©¢å¤±æ•— â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const eventUrl = obj.data.basic.event_code;
            let module_id = 0;
            let found = false;
            for (const item of obj.data.modules) {
              if (item.module_name === 'Service.LUCKY_DRAW_COMPONENT') {
                module_id = item.module_id;
                found = true;
                break;
              }
            }
            if (found) {
              shippingLuckyRrawGetDailyChanceRequest.url = 'https://games.shopee.vn/gameplatform/api/v1/chance/35651/event/' + eventUrl + '/query?appid=E9VFyxwmtgjnCR8uhL&basic=false'
              shippingLuckyRrawRequest.url = 'https://games.shopee.vn/luckydraw/api/v1/lucky/event/' + eventUrl;
              // shippingLuckyRrawRequest.body.schedule_ldc_id = module_id;
              console.log('đŸ¤ è¦ç®å…é‹å¯¶ç®±ç¶²å€æŸ¥è©¢æˆåŸï¼ ' + shippingLuckyRrawRequest.url + ' Module Id: ' + module_id);
              // shopeeNotify(
              //   'è¦ç®å…é‹å¯¶ç®±ç¶²å€æŸ¥è©¢æˆåŸ',
              //   shippingLuckyRrawRequest.url + ' Module Id: ' + module_id
              // );
              shippingLuckyDrawGetChance();
            }
            else {
              shopeeNotify(
                'å¯¶ç®±ç¶²å€æŸ¥è©¢å¤±æ•— â€¼ï¸',
                'æ‰¾ä¸åˆ°æ´»å‹•'
              );
              $done();
            }
          } else {
            shopeeNotify(
              'å¯¶ç®±ç¶²å€æŸ¥è©¢å¤±æ•— â€¼ï¸',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          shopeeNotify(
            'å¯¶ç®±ç¶²å€æŸ¥è©¢å¤±æ•— â€¼ï¸',
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

function shippingLuckyDrawGetChance() {
  $httpClient.get(shippingLuckyRrawGetDailyChanceRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'æŸ¥è©¢å‰©é¤˜æ¬¡æ•¸å¤±æ•— â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.data.daily_chance > 0) {
            shippingLuckyDraw();
          }
          else {
            // ç–‘ä¼¼ä¸æœƒè·‘åˆ°é€™é‚
            shopeeNotify(
              'é ˜å–å¤±æ•— â€¼ï¸',
              'æ¯æ—¥åªèƒ½å…è²»é ˜ä¸€æ¬¡'
            );
            $done();
          }
        }
        catch (error) {
          shopeeNotify(
            'æŸ¥è©¢å‰©é¤˜æ¬¡æ•¸å¤±æ•— â€¼ï¸',
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

function shippingLuckyDraw() {
  $httpClient.post(shippingLuckyRrawRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'é ˜å–å¤±æ•— â€¼ï¸',
        'é€£ç·éŒ¯èª¤'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const packageName = obj.data.package_name;
            shopeeNotify(
              'é ˜å–æˆåŸ âœ…',
              'ç²å¾— đŸ‘‰ ' + packageName + ' đŸ’'
            );
          } else if (obj.msg === 'expired' || obj.msg === 'event already end') {
            shopeeNotify(
              'é ˜å–å¤±æ•— â€¼ï¸',
              'æ´»å‹•å·²éæœŸă€‚è«‹å˜—è©¦æ›´æ–°æ¨¡çµ„æˆ–è…³æœ¬ï¼Œæˆ–ç­‰å¾…ä½œè€…æ›´æ–°'
            );
          } else if (obj.msg === 'no chance') {
            shopeeNotify(
              'é ˜å–å¤±æ•— â€¼ï¸',
              'æ¯æ—¥åªèƒ½å…è²»é ˜ä¸€æ¬¡'
            );
          } else {
            shopeeNotify(
              'é ˜å–å¤±æ•— â€¼ï¸',
              obj.msg
            );
          }
        }
        catch (error) {
          shopeeNotify(
            'é ˜å–å¤±æ•— â€¼ï¸',
            error
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
