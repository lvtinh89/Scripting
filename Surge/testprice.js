/*

【Quantumult X】
————————————————
30 7-22 * * * https://langkhach.imfast.io/scripts/langkhach/Appmonitor.js, tag=Appmonitor

【Surge】
————————————————
Appmonitor = type=cron,cronexp="30 7-22 * * *",script-path=https://langkhach.imfast.io/scripts/langkhach/Appmonitor.js,wake-system=true,timeout=600

【Loon】
————————————————
cron "30 7-22 * * *" script-path=https://langkhach.imfast.io/scripts/langkhach/Appmonitor.js, timeout=600, tag=Appmonitor

apps=["1443988620:hk","1443988620/us","1443988620-uk","1443988620_jp","1443988620 au"]

*/
const $ = new API("Appmonitor", true);
let apps = [
  "1027787952","1021566244","916366645","970353453","596684220","1444671526","1300697619","284666222","1457771281","442012681","804177739","558818638","1373567447","932747118","1252015438","556666026","1117998129","382011064","669835030","688831692","317107309","360593530","1319618742","469343097","728293409","527358348","1389752090","479516143","1062022008","924695435","1112850631","471784765","1110639444","691121579","1116905928","1444383602","436577167","606310581","992357547","579523206","284882215","585253443","544007664","414706506","570435154","705211891","454638411","585027354","959841449","790034666","962194608","469337564","382617920","310633997","389801252","477537958","507874739","834742893","1210763463","1192965614","1001507516","333903271","864653381","1126386264","1047223162","304878510","1160167263","1061867449","324684580","393149734","1359763765","826543747","904209370","931883425","1286983622","1235601864","686449807","842842640","842849113","1034726283","1442620678","879478102","936971630","958100553","1292563772","1450468835","777554515","1439523058","947291031","1032301823","1344700109","306310789","1462680353","440676901","981863450","1462416637","751096907","1385287093","367003839","1400740705","439438619","878783582","971995033","333710667","448278467","570060128","585332633","985746746","389793068","336978041","1002043426","1223932558","388627783","1477505685","896694807","930331514","1443988620","1338092370","1422605014","541164041","1129435228","888530356","1187265767","546505307","438596432","492648096","441697527"
]; //appid
if ($.read("apps") != "" && $.read("apps") != undefined) {
  apps = $.read("apps").split("，");
}
let reg = "vn"; 
if ($.read("reg") != "" && $.read("reg") != undefined) {
  reg = $.read("reg");
}
let notifys = [];
format_apps(apps);
function format_apps(x) {
  let apps_f = {};
  x.forEach(n => {
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
        notifys.push(`ID format error:【${n}】`);
      }
    } else {
      notifys.push(`ID Format error:【${n}】`);
    }
  });
  if (Object.keys(apps_f).length > 0) {
    post_data(apps_f);
  }
}
async function post_data(d) {
  try {
    let app_monitor = $.read("Appmonitor");
    if (app_monitor === "" || app_monitor === undefined) {
      app_monitor = {};
    } else {
      app_monitor = JSON.parse(app_monitor);
      console.log(app_monitor);
    }
    let infos = {};
    await Promise.all(
      Object.keys(d).map(async k => {
        let config = {
          url: "https://itunes.apple.com/lookup?id=" + d[k] + "&country=" + k
        };
        await $.http
          .get(config)
          .then(response => {
            let results = JSON.parse(response.body).results;
            if (Array.isArray(results) && results.length > 0) {
              results.forEach(x => {
                infos[x.trackId] = {
                  n: x.trackName,
                  v: x.version,
                  p: x.formattedPrice
                };
                if (app_monitor.hasOwnProperty(x.trackId)) {
                  if (
                    JSON.stringify(app_monitor[x.trackId]) !==
                    JSON.stringify(infos[x.trackId])
                  ) {
                    if (x.version !== app_monitor[x.trackId].v) {
                      notifys.push(
                        `${flag(k)}🧩${x.trackName}: v【${x.version}】`
                      );
                    }
                    if (x.formattedPrice !== app_monitor[x.trackId].p) {
                      notifys.push(
                        `${flag(k)}💰${x.trackName}: p【${x.formattedPrice}】`
                      );
                    }
                  }
                } else {
                  notifys.push(
                    `${flag(k)}🧩${x.trackName}: v【${x.version}】`
                  );
                  notifys.push(
                    `${flag(k)}💰${x.trackName}: p【${x.formattedPrice}】`
                  );
                }
              });
            }
            return Promise.resolve();
          })
          .catch(e => {
            console.log(e);
          });
      })
    );
    infos = JSON.stringify(infos);
    $.write(infos, "Appmonitor");
    if (notifys.length > 0) {
      notify(notifys);
    } else {
      console.log("Appmonitor：No change");
      $.done;
    }
  } catch (e) {
    console.log(e);
  }
}
function notify(notifys) {
  notifys = notifys.join("\n");
  console.log(notifys);
  $.notify("Appmonitor", "", notifys);
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
    ["VN", "🇻🇳"]
  ]);
  return flags.get(x.toUpperCase());
}

//From  OpenAPI.js
function ENV() {
  const e = "undefined" != typeof $task,
    t = "undefined" != typeof $loon,
    s = "undefined" != typeof $httpClient && !this.isLoon,
    o = "function" == typeof require && "undefined" != typeof $jsbox;
  return {
    isQX: e,
    isLoon: t,
    isSurge: s,
    isNode: "function" == typeof require && !o,
    isJSBox: o
  };
}
function HTTP(e, t = {}) {
  const { isQX: s, isLoon: o, isSurge: n } = ENV();
  const i = {};
  return (
    ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(
      r =>
        (i[r.toLowerCase()] = i =>
          (function(i, r) {
            (r = "string" == typeof r ? { url: r } : r).url = e
              ? e + r.url
              : r.url;
            const h = (r = { ...t, ...r }).timeout,
              c = {
                onRequest: () => {},
                onResponse: e => e,
                onError: e => {
                  throw e;
                },
                ...r.event
              };
            let u = null;
            c.onRequest(r),
              (u = s
                ? $task.fetch({ method: i, ...r })
                : new Promise((e, t) => {
                    (n || o ? $httpClient : require("request"))[
                      i.toLowerCase()
                    ](r, (s, o, n) => {
                      s
                        ? t(s)
                        : e({
                            statusCode: o.status || o.statusCode,
                            headers: o.headers,
                            body: n
                          });
                    });
                  }));
            const l = new Promise((e, t) => {
              setTimeout(t, h, `${i} URL: ${r.url} exceeded timeout ${h} ms!`);
            });
            return (h ? Promise.race([u, l]) : u)
              .then(e => c.onResponse(e))
              .catch(e => {
                c.onError(e);
              });
          })(r, i))
    ),
    i
  );
}
function API(e = "untitled", t = !1) {
  const { isQX: s, isLoon: o, isSurge: n, isNode: i, isJSBox: r } = ENV();
  return new (class {
    constructor(e, t) {
      (this.name = e),
        (this.debug = t),
        (this.http = HTTP()),
        (this.env = ENV()),
        (this.node = (() => {
          if (i) {
            return { fs: require("fs") };
          }
          return null;
        })()),
        this.initCache();
      Promise.prototype.delay = function(e) {
        return this.then(function(t) {
          return ((e, t) =>
            new Promise(function(s) {
              setTimeout(s.bind(null, t), e);
            }))(e, t);
        });
      };
    }
    initCache() {
      if (
        (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")),
        (o || n) &&
          (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")),
        i)
      ) {
        let e = "root.json";
        this.node.fs.existsSync(e) ||
          this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e =>
            console.log(e)
          ),
          (this.root = {}),
          (e = `${this.name}.json`),
          this.node.fs.existsSync(e)
            ? (this.cache = JSON.parse(
                this.node.fs.readFileSync(`${this.name}.json`)
              ))
            : (this.node.fs.writeFileSync(
                e,
                JSON.stringify({}),
                { flag: "wx" },
                e => console.log(e)
              ),
              (this.cache = {}));
      }
    }
    persistCache() {
      const e = JSON.stringify(this.cache);
      s && $prefs.setValueForKey(e, this.name),
        (o || n) && $persistentStore.write(e, this.name),
        i &&
          (this.node.fs.writeFileSync(
            `${this.name}.json`,
            e,
            { flag: "w" },
            e => console.log(e)
          ),
          this.node.fs.writeFileSync(
            "root.json",
            JSON.stringify(this.root),
            { flag: "w" },
            e => console.log(e)
          ));
    }
    write(e, t) {
      this.log(`SET ${t}`),
        -1 !== t.indexOf("#")
          ? ((t = t.substr(1)),
            n & o && $persistentStore.write(e, t),
            s && $prefs.setValueForKey(e, t),
            i && (this.root[t] = e))
          : (this.cache[t] = e),
        this.persistCache();
    }
    read(e) {
      return (
        this.log(`READ ${e}`),
        -1 === e.indexOf("#")
          ? this.cache[e]
          : ((e = e.substr(1)),
            n & o
              ? $persistentStore.read(e)
              : s
              ? $prefs.valueForKey(e)
              : i
              ? this.root[e]
              : void 0)
      );
    }
    delete(e) {
      this.log(`DELETE ${e}`),
        delete this.cache[e],
        -1 !== e.indexOf("#")
          ? ((e = e.substr(1)),
            n & o && $persistentStore.write(null, e),
            s && $prefs.setValueForKey(null, e),
            i && delete this.root[e])
          : (this.cache[e] = data),
        this.persistCache();
    }
    notify(e, t = "", h = "", c = {}) {
      const u = c["open-url"],
        l = c["media-url"],
        a = h + (u ? `\n点击跳转: ${u}` : "") + (l ? `\n多媒体: ${l}` : "");
      if (
        (s && $notify(e, t, h, c),
        n && $notification.post(e, t, a),
        o && $notification.post(e, t, h, u),
        i)
      )
        if (r) {
          require("push").schedule({ title: e, body: (t ? t + "\n" : "") + a });
        } else console.log(`${e}\n${t}\n${a}\n\n`);
    }
    log(e) {
      this.debug && console.log(e);
    }
    info(e) {
      console.log(e);
    }
    error(e) {
      console.log("ERROR: " + e);
    }
    wait(e) {
      return new Promise(t => setTimeout(t, e));
    }
    done(e = {}) {
      s || o || n
        ? $done(e)
        : i &&
          !r &&
          "undefined" != typeof $context &&
          (($context.headers = e.headers),
          ($context.statusCode = e.statusCode),
          ($context.body = e.body));
    }
  })(e, t);
}
