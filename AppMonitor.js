const $ = new API("App💥Monitor");
let apps=["1134218562","1035331258","694647259","766858884","1027787952","1021566244","916366645","970353453","596684220","1444671526","1300697619","284666222","1457771281","442012681","804177739","558818638","1373567447","932747118","1252015438","556666026","1117998129","382011064","669835030","688831692","317107309","360593530","1319618742","469343097","728293409","527358348","1389752090","479516143","1062022008","924695435","1112850631","471784765","1110639444","691121579","1116905928","1444383602","436577167","606310581","992357547","579523206","284882215","585253443","544007664","414706506","570435154","705211891","454638411","585027354","959841449","790034666","962194608","469337564","382617920","310633997","389801252","477537958","507874739","834742893","1210763463","1192965614","1001507516","333903271","864653381","1126386264","1047223162","304878510","1160167263","1061867449","324684580","393149734","1359763765","826543747","904209370","931883425","1286983622","1235601864","686449807","842842640","842849113","1034726283","1442620678","879478102","936971630","958100553","1292563772","1450468835","777554515","1439523058","947291031","1032301823","1344700109","306310789","1462680353","440676901","981863450","1462416637","751096907","1385287093","367003839","1400740705","439438619","878783582","971995033","333710667","448278467","570060128","585332633","985746746","389793068","336978041","1002043426","1223932558","388627783","1477505685","896694807","930331514","1443988620","1338092370","1422605014","541164041","1129435228","888530356","1187265767","546505307","438596432","492648096","441697527"];
let reg="vn";
let notifys = [];
format_apps(apps);
function format_apps(x) {
  let apps_f = {};
  x.forEach((n) => {
    if (/^[a-zA-Z0-9:/|\-_\s]{1,}$/.test(n)) {
      n = n.replace(/[/|\-_\s]/g, ":");
      let n_n = n.split(":");
      if (n_n.length === 1) {
        if (apps_f.hasOwnProperty(reg)) {
          apps_f[reg].push(n_n);
        } else {
          apps_f[reg] = [];
          apps_f[reg].push(n_n[0]);
        }
      } else if (n_n.length === 2) {
        if (apps_f.hasOwnProperty(n_n[1])) {
          apps_f[n_n[1]].push(n_n[0]);
        } else {
          apps_f[n_n[1]] = [];
          apps_f[n_n[1]].push(n_n[0]);
        }
      } else {
        notifys.push(`ID error:【${n}】`);
      }
    } else {
      notifys.push(`ID error:【${n}】`);
    }
  });
  if (Object.keys(apps_f).length > 0) {
    post_data(apps_f);
  }
}
async function post_data(d) {
  try {
    let app_monitor = $.read("app_monitor");
    if (app_monitor === "" || app_monitor === undefined) {
      app_monitor = {};
    } else {
      app_monitor = JSON.parse(app_monitor);
      console.log(app_monitor);
    }
    let infos = {};
    await Promise.all(
      Object.keys(d).map(async (k) => {
        let config = {
          url: "https://itunes.apple.com/lookup?id=" + d[k] + "&country=" + k,
        };
        await $.http
          .get(config)
          .then((response) => {
            let results = JSON.parse(response.body).results;
            if (Array.isArray(results) && results.length > 0) {
              results.forEach((x) => {
                infos[x.trackId] = {
                  n: x.trackName,
                  v: x.version,
                  p: x.formattedPrice,
                };
                if (app_monitor.hasOwnProperty(x.trackId)) {
                  if (
                    JSON.stringify(app_monitor[x.trackId]) !==
                    JSON.stringify(infos[x.trackId])
                  ) {
                    if (x.version !== app_monitor[x.trackId].v) {
                      notifys.push(
                        `${flag(k)}🏷${x.trackName}: Version🆙【${x.version}】`
                      );
                    }
                    if (x.formattedPrice !== app_monitor[x.trackId].p) {
                      notifys.push(
                        `${flag(k)}💰${x.trackName}: Price〽️【${x.formattedPrice}】`
                      );
                    }
                  }
                } else {
                  notifys.push(
                    `${flag(k)}🏷${x.trackName}: Version【${x.version}】`
                  );
                  notifys.push(
                    `${flag(k)}💰${x.trackName}: Price【${x.formattedPrice}】`
                  );
                }
              });
            }
            return Promise.resolve();
          })
          .catch((e) => {
            console.log(e);
          });
      })
    );
    infos = JSON.stringify(infos);
    $.write(infos, "app_monitor");
    if (notifys.length > 0) {
      notify(notifys);
    } else {
      console.log("App💥Monitor：No change in version and price 🔕");
      $.done;
    }
  } catch (e) {
    console.log(e);
  }
}
function notify(notifys) {
  notifys = notifys.join("\n");
  console.log(notifys);
  $.notify("App💥Monitor", "", notifys);
  $.done;
}
function flag(x) {
  var flags = new Map([
    ["AC", "🇦🇨"],
    ["AF", "🇦🇫"],
    ["AI", "🇦🇮"],
    ["AL", "🇦🇱"],
    ["AM", "🇦🇲"],
    ["AQ", "🇦🇶"],
    ["AR", "🇦🇷"],
    ["AS", "🇦🇸"],
    ["AT", "🇦🇹"],
    ["AU", "🇦🇺"],
    ["AW", "🇦🇼"],
    ["AX", "🇦🇽"],
    ["AZ", "🇦🇿"],
    ["BB", "🇧🇧"],
    ["BD", "🇧🇩"],
    ["BE", "🇧🇪"],
    ["BF", "🇧🇫"],
    ["BG", "🇧🇬"],
    ["BH", "🇧🇭"],
    ["BI", "🇧🇮"],
    ["BJ", "🇧🇯"],
    ["BM", "🇧🇲"],
    ["BN", "🇧🇳"],
    ["BO", "🇧🇴"],
    ["BR", "🇧🇷"],
    ["BS", "🇧🇸"],
    ["BT", "🇧🇹"],
    ["BV", "🇧🇻"],
    ["BW", "🇧🇼"],
    ["BY", "🇧🇾"],
    ["BZ", "🇧🇿"],
    ["CA", "🇨🇦"],
    ["CF", "🇨🇫"],
    ["CH", "🇨🇭"],
    ["CK", "🇨🇰"],
    ["CL", "🇨🇱"],
    ["CM", "🇨🇲"],
    ["CN", "🇨🇳"],
    ["CO", "🇨🇴"],
    ["CP", "🇨🇵"],
    ["CR", "🇨🇷"],
    ["CU", "🇨🇺"],
    ["CV", "🇨🇻"],
    ["CW", "🇨🇼"],
    ["CX", "🇨🇽"],
    ["CY", "🇨🇾"],
    ["CZ", "🇨🇿"],
    ["DE", "🇩🇪"],
    ["DG", "🇩🇬"],
    ["DJ", "🇩🇯"],
    ["DK", "🇩🇰"],
    ["DM", "🇩🇲"],
    ["DO", "🇩🇴"],
    ["DZ", "🇩🇿"],
    ["EA", "🇪🇦"],
    ["EC", "🇪🇨"],
    ["EE", "🇪🇪"],
    ["EG", "🇪🇬"],
    ["EH", "🇪🇭"],
    ["ER", "🇪🇷"],
    ["ES", "🇪🇸"],
    ["ET", "🇪🇹"],
    ["EU", "🇪🇺"],
    ["FI", "🇫🇮"],
    ["FJ", "🇫🇯"],
    ["FK", "🇫🇰"],
    ["FM", "🇫🇲"],
    ["FO", "🇫🇴"],
    ["FR", "🇫🇷"],
    ["GA", "🇬🇦"],
    ["GB", "🇬🇧"],
    ["HK", "🇭🇰"],
    ["ID", "🇮🇩"],
    ["IE", "🇮🇪"],
    ["IL", "🇮🇱"],
    ["IM", "🇮🇲"],
    ["IN", "🇮🇳"],
    ["IS", "🇮🇸"],
    ["IT", "🇮🇹"],
    ["JP", "🇯🇵"],
    ["KR", "🇰🇷"],
    ["MO", "🇲🇴"],
    ["MX", "🇲🇽"],
    ["MY", "🇲🇾"],
    ["NL", "🇳🇱"],
    ["PH", "🇵🇭"],
    ["RO", "🇷🇴"],
    ["RS", "🇷🇸"],
    ["RU", "🇷🇺"],
    ["RW", "🇷🇼"],
    ["SA", "🇸🇦"],
    ["SB", "🇸🇧"],
    ["SC", "🇸🇨"],
    ["SD", "🇸🇩"],
    ["SE", "🇸🇪"],
    ["SG", "🇸🇬"],
    ["TH", "🇹🇭"],
    ["TN", "🇹🇳"],
    ["TO", "🇹🇴"],
    ["TR", "🇹🇷"],
    ["TV", "🇹🇻"],
    ["TW", "🇨🇳"],
    ["UK", "🇬🇧"],
    ["UM", "🇺🇲"],
    ["US", "🇺🇸"],
    ["UY", "🇺🇾"],
    ["UZ", "🇺🇿"],
    ["VA", "🇻🇦"],
    ["VE", "🇻🇪"],
    ["VG", "🇻🇬"],
    ["VI", "🇻🇮"],
    ["VN", "🇻🇳"],
  ]);
  return flags.get(x.toUpperCase());
}

//From Peng-YM's OpenAPI.js
function ENV() {
  const isQX = typeof $task !== "undefined";
  const isLoon = typeof $loon !== "undefined";
  const isSurge = typeof $httpClient !== "undefined" && !isLoon;
  const isJSBox = typeof require == "function" && typeof $jsbox != "undefined";
  const isNode = typeof require == "function" && !isJSBox;
  const isRequest = typeof $request !== "undefined";
  const isScriptable = typeof importModule !== "undefined";
  return { isQX, isLoon, isSurge, isNode, isJSBox, isRequest, isScriptable };
}

function HTTP(defaultOptions = { baseURL: "" }) {
  const { isQX, isLoon, isSurge, isScriptable, isNode } = ENV();
  const methods = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"];
  const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  function send(method, options) {
    options = typeof options === "string" ? { url: options } : options;
    const baseURL = defaultOptions.baseURL;
    if (baseURL && !URL_REGEX.test(options.url || "")) {
      options.url = baseURL ? baseURL + options.url : options.url;
    }
    options = { ...defaultOptions, ...options };
    const timeout = options.timeout;
    const events = {
      ...{
        onRequest: () => {},
        onResponse: (resp) => resp,
        onTimeout: () => {},
      },
      ...options.events,
    };

    events.onRequest(method, options);

    let worker;
    if (isQX) {
      worker = $task.fetch({ method, ...options });
    } else if (isLoon || isSurge || isNode) {
      worker = new Promise((resolve, reject) => {
        const request = isNode ? require("request") : $httpClient;
        request[method.toLowerCase()](options, (err, response, body) => {
          if (err) reject(err);
          else
            resolve({
              statusCode: response.status || response.statusCode,
              headers: response.headers,
              body,
            });
        });
      });
    } else if (isScriptable) {
      const request = new Request(options.url);
      request.method = method;
      request.headers = options.headers;
      request.body = options.body;
      worker = new Promise((resolve, reject) => {
        request
          .loadString()
          .then((body) => {
            resolve({
              statusCode: request.response.statusCode,
              headers: request.response.headers,
              body,
            });
          })
          .catch((err) => reject(err));
      });
    }

    let timeoutid;
    const timer = timeout
      ? new Promise((_, reject) => {
          timeoutid = setTimeout(() => {
            events.onTimeout();
            return reject(
              `${method} URL: ${options.url} exceeds the timeout ${timeout} ms`
            );
          }, timeout);
        })
      : null;

    return (timer
      ? Promise.race([timer, worker]).then((res) => {
          clearTimeout(timeoutid);
          return res;
        })
      : worker
    ).then((resp) => events.onResponse(resp));
  }

  const http = {};
  methods.forEach(
    (method) =>
      (http[method.toLowerCase()] = (options) => send(method, options))
  );
  return http;
}

function API(name = "untitled", debug = false) {
  const { isQX, isLoon, isSurge, isNode, isJSBox, isScriptable } = ENV();
  return new (class {
    constructor(name, debug) {
      this.name = name;
      this.debug = debug;

      this.http = HTTP();
      this.env = ENV();

      this.node = (() => {
        if (isNode) {
          const fs = require("fs");

          return {
            fs,
          };
        } else {
          return null;
        }
      })();
      this.initCache();

      const delay = (t, v) =>
        new Promise(function (resolve) {
          setTimeout(resolve.bind(null, v), t);
        });

      Promise.prototype.delay = function (t) {
        return this.then(function (v) {
          return delay(t, v);
        });
      };
    }

    // persistence
    // initialize cache
    initCache() {
      if (isQX) this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}");
      if (isLoon || isSurge)
        this.cache = JSON.parse($persistentStore.read(this.name) || "{}");

      if (isNode) {
        // create a json for root cache
        let fpath = "root.json";
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            { flag: "wx" },
            (err) => console.log(err)
          );
        }
        this.root = {};

        // create a json file with the given name if not exists
        fpath = `${this.name}.json`;
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            { flag: "wx" },
            (err) => console.log(err)
          );
          this.cache = {};
        } else {
          this.cache = JSON.parse(
            this.node.fs.readFileSync(`${this.name}.json`)
          );
        }
      }
    }

    // store cache
    persistCache() {
      const data = JSON.stringify(this.cache, null, 2);
      if (isQX) $prefs.setValueForKey(data, this.name);
      if (isLoon || isSurge) $persistentStore.write(data, this.name);
      if (isNode) {
        this.node.fs.writeFileSync(
          `${this.name}.json`,
          data,
          { flag: "w" },
          (err) => console.log(err)
        );
        this.node.fs.writeFileSync(
          "root.json",
          JSON.stringify(this.root, null, 2),
          { flag: "w" },
          (err) => console.log(err)
        );
      }
    }

    write(data, key) {
      this.log(`SET ${key}`);
      if (key.indexOf("#") !== -1) {
        key = key.substr(1);
        if (isSurge || isLoon) {
          return $persistentStore.write(data, key);
        }
        if (isQX) {
          return $prefs.setValueForKey(data, key);
        }
        if (isNode) {
          this.root[key] = data;
        }
      } else {
        this.cache[key] = data;
      }
      this.persistCache();
    }

    read(key) {
      this.log(`READ ${key}`);
      if (key.indexOf("#") !== -1) {
        key = key.substr(1);
        if (isSurge || isLoon) {
          return $persistentStore.read(key);
        }
        if (isQX) {
          return $prefs.valueForKey(key);
        }
        if (isNode) {
          return this.root[key];
        }
      } else {
        return this.cache[key];
      }
    }

    delete(key) {
      this.log(`DELETE ${key}`);
      if (key.indexOf("#") !== -1) {
        key = key.substr(1);
        if (isSurge || isLoon) {
          return $persistentStore.write(null, key);
        }
        if (isQX) {
          return $prefs.removeValueForKey(key);
        }
        if (isNode) {
          delete this.root[key];
        }
      } else {
        delete this.cache[key];
      }
      this.persistCache();
    }

    // notification
    notify(title, subtitle = "", content = "", options = {}) {
      const openURL = options["open-url"];
      const mediaURL = options["media-url"];

      if (isQX) $notify(title, subtitle, content, options);
      if (isSurge) {
        $notification.post(
          title,
          subtitle,
          content + `${mediaURL ? "\n多媒体:" + mediaURL : ""}`,
          {
            url: openURL,
          }
        );
      }
      if (isLoon) {
        let opts = {};
        if (openURL) opts["openUrl"] = openURL;
        if (mediaURL) opts["mediaUrl"] = mediaURL;
        if (JSON.stringify(opts) === "{}") {
          $notification.post(title, subtitle, content);
        } else {
          $notification.post(title, subtitle, content, opts);
        }
      }
      if (isNode || isScriptable) {
        const content_ =
          content +
          (openURL ? `\n点击跳转: ${openURL}` : "") +
          (mediaURL ? `\n多媒体: ${mediaURL}` : "");
        if (isJSBox) {
          const push = require("push");
          push.schedule({
            title: title,
            body: (subtitle ? subtitle + "\n" : "") + content_,
          });
        } else {
          console.log(`${title}\n${subtitle}\n${content_}\n\n`);
        }
      }
    }

    // other helper functions
    log(msg) {
      if (this.debug) console.log(`[${this.name}] LOG: ${msg}`);
    }

    info(msg) {
      console.log(`[${this.name}] INFO: ${msg}`);
    }

    error(msg) {
      console.log(`[${this.name}] ERROR: ${msg}`);
    }

    wait(millisec) {
      return new Promise((resolve) => setTimeout(resolve, millisec));
    }

    done(value = {}) {
      if (isQX || isLoon || isSurge) {
        $done(value);
      } else if (isNode && !isJSBox) {
        if (typeof $context !== "undefined") {
          $context.headers = value.headers;
          $context.statusCode = value.statusCode;
          $context.body = value.body;
        }
      }
    }
  })(name, debug);
}