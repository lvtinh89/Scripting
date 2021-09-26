/*using surge cron*/

const region = "vn"
const appIds = ["1073473333","1438091392","945481730","1085978097","951627022","691121579","1373567447","932747118","1443988620","317107309","924695435","951615851","1126386264","1062022008","606310581","436577167","1444383602","1319618742","469343097","971304016","1389752090","1239299402","527358348","479516143"];

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
