var baby = JSON.parse($response.body);

baby = {
  "license" : {
    "status" : "sub",
    "expireTime" : 101966821994000
  },
  "_code" : 200,
  "raw_data" : "bKnTeMMu/TJ86ZFoUqG+sfKC1nitD8b/NaUT93UBc0woo0BF5uBVYXsHUQJkQxLHGlZCbdnKaKzZ4iljM9xddkyMycpUbAtDoywnr4RNzxqXY20pDM0Bdgm+HssaS1RworH8aaaf0IYnnGplxIuqMyT9107PrenF0MBUIaKU9Cw="
};

$done({body : JSON.stringify(baby)});
