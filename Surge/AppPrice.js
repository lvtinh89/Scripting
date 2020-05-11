/*using surge cron*/

const region = "vn"
const appIds = ["1406710800","1062022008","503812755","451375935","385898687","1112850631","606310581","436577167","1117998129","1474856599","730712409","1319618742","1117941080","896694807","388627783","1442620678","382011064","1018301773","1047223162","1110639444","1192965614","333710667","1160167263","1450468835","1359763765","1338092370","1365531024","1282297037","1357644265","1210562295","932747118","1373567447","1083468087","1126386264","558818638","691121579","1252015438","1443988620","1422605014","407445075","479181299","1444636541","1271086060","492648096","363317633","669835030","358207332","688831692","924695435","472591011","749132901","317107309","374211477","360593530","1444383602","1118115766","1187265767","728293409","527358348","556666026","1389752090","469343097","1462397316","479516143"]
var cacheData = $persistentStore.read()
if (!cacheData) {
    cacheData = {}
} else {
    cacheData = JSON.parse(cacheData)
}

$httpClient.post('https://itunes.apple.com/lookup?id=' + appIds + "&country=" + region, function (error, response, data) {
    if (error) {
        console.log(error);
        $notification.post("App Pricer", "bad connection")
        $done()
    } else {
        let appData = JSON.parse(data).results
        let priceChanged = ""
        let newAppAdded = ""
        for (var i = 0; i < appData.length; i++) {
            if (cacheData[appData[i].trackId]) {
                if (appData[i].formattedPrice != cacheData[appData[i].trackId].price) {
                    priceChanged = priceChanged + "🏷 " + appData[i].trackName + "  " + cacheData[appData[i].trackId].price + " → " + appData[i].formattedPrice + "\n"
                    cacheData[appData[i].trackId].price = appData[i].formattedPrice
                }
            } else {
                newAppAdded = newAppAdded + "🏷 " + appData[i].trackName + "  " + appData[i].formattedPrice + "\n"
                cacheData[appData[i].trackId] = {
                    name: appData[i].trackName,
                    price: appData[i].formattedPrice
                }
            }
        }
        if (priceChanged) {
            $notification.post("Price Changed", "", priceChanged)
        }
        if (newAppAdded) {
            $notification.post("New Apps Added", "", newAppAdded)
        }
        $persistentStore.write(JSON.stringify(cacheData))
        $done()
    }
})
