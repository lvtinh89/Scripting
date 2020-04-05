//Smart Qx&Surge + @Neurogam
let isQuantumultX = $task !== undefined;
let isSurge = $httpClient !== undefined;
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                }
            })

        }
    }
}
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
//end

console.log("🟢 AppMonitor");
let apps=["1406710800","1062022008","503812755","451375935","385898687","1112850631","606310581","436577167","1117998129","1474856599","730712409","1319618742","1117941080","896694807","388627783","1442620678","382011064","1018301773","1047223162","1110639444","1192965614","333710667","1160167263","1450468835","1359763765","1338092370","1365531024","1282297037","1357644265","1210562295","932747118","1373567447","1083468087","1126386264","558818638","691121579","1252015438","1443988620","1422605014","407445075","479181299","1444636541","1271086060","492648096","363317633","669835030","358207332","688831692","924695435","472591011","749132901","317107309","374211477","360593530","1444383602","1118115766","1187265767","728293409","527358348","556666026","1389752090","469343097","1462397316","479516143"];
let reg="vn";
let notifys=[];
format_apps(apps);
function format_apps(x) {
    let apps_f={};
    x.forEach((n)=>{
        if(/^[a-zA-Z0-9:/|\-_\s]{1,}$/.test(n))
        {
            n=n.replace(/[/|\-_\s]/g,":");
            let n_n=n.split(":");
            if(n_n.length===1){
                if(apps_f.hasOwnProperty(reg)){
                    apps_f[reg].push(n_n);
                }
                else
                {
                    apps_f[reg]=[];
                    apps_f[reg].push(n_n[0])
                }
            }
            else if(n_n.length===2){
                if(apps_f.hasOwnProperty(n_n[1])){
                    apps_f[n_n[1]].push(n_n[0]);
                }
                else
                {
                    apps_f[n_n[1]]=[];
                    apps_f[n_n[1]].push(n_n[0])
                }
            }
            else{
                notifys.push(`ID error:【${n}】`)
            }
        }
        else{
            notifys.push(`ID error:【${n}】`)
        }
    });
    if(Object.keys(apps_f).length>0){
        post_data(apps_f);
    }
}
async function post_data(d) {
    try{
        let app_monitor=$prefs.valueForKey("app_monitor");
        if(app_monitor===""||app_monitor===undefined){
            app_monitor={}
        }
        else{
            app_monitor=JSON.parse(app_monitor)
        }
        let infos={};
        await Promise.all(Object.keys(d).map(async (k)=>{
            let config={
                url:'https://itunes.apple.com/lookup?id=' + d[k] + "&country=" + k,
                method:"post"
            };
            await $task.fetch(config).then((res)=>{
                let results=JSON.parse(res.body).results;
                if(Array.isArray(results)&&results.length>0){
                    results.forEach((x=>{
                        infos[x.trackId]={
                            n:x.trackName,
                            v:x.version,
                            p:x.formattedPrice
                        };
                        if(app_monitor.hasOwnProperty(x.trackId)){
                            if(JSON.stringify(app_monitor[x.trackId])!==JSON.stringify(infos[x.trackId])){
                                if(x.version!==app_monitor[x.trackId].v){
                                    notifys.push(`${flag(k)}🏷${x.trackName}:version【${x.version}】`)
                                }
                                if(x.formattedPrice!==app_monitor[x.trackId].p){
                                    notifys.push(`${flag(k)}💰${x.trackName}:price【${x.formattedPrice}】`)
                                }
                            }}
                        else{
                            notifys.push(`${flag(k)}🏷${x.trackName}:version【${x.version}】`);
                            notifys.push(`${flag(k)}💰${x.trackName}:price【${x.formattedPrice}】`)
                        }
                    }));
                }
                return Promise.resolve()
            }).catch((e)=>{
                console.log(e);
            });
        }));
        infos=JSON.stringify(infos);
        $prefs.setValueForKey(infos,"app_monitor");
        if(notifys.length>0){
            notify(notifys)
        }
        else{
            console.log("AppMonitor：No change 🔕")
        }
    }catch (e) {
        console.log(e);
    }
}
function notify(notifys){
    notifys=notifys.join("\n");
    console.log(notifys);
    $notify("AppMonitor","",notifys)
}
function flag(x){
  var flags = new Map([[ "AC" , "🇦🇨" ] , [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫🇴" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] , [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇸🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ]])
  return flags.get(x.toUpperCase())
}