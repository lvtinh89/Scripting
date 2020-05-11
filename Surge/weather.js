const lang = "en"
var lat_lon = "21.11769957004219,105.8315802925321"
var api = "80d64191166d1892bdf3e4c31a890720"
async function launch() {
    await weather();
    $done();
}

launch()

function weather() {
    let info = {
        url: "https://api.darksky.net/forecast/" + api + "/" + lat_lon + "?lang=" + lang + "&units=si&exclude=currently,minutely",  //?lang=en&units=si
        headers: {},
    }
    $httpClient.get(info, async function (error, response, data) {
        if (error) {
            console.log(error);
            $notification.post("Hanoi's weather", lat_lon + 'bad connection', error);
        } else {
            var obj = JSON.parse(data);
            console.log(obj);
            var hour_summary = obj.hourly.summary;
            var icon_text = obj.hourly.icon;
            var icon = "❓"
            if (icon_text == "clear-day") icon = "☀️";
            if (icon_text == "partly-cloudy-day") icon = "🌤";
            if (icon_text == "cloudy") icon = "☁️";
            if (icon_text == "rain") icon = "🌧";
            if (icon_text == "snow") icon = "☃️";
            if (icon_text == "sleet") icon = "🌨";
            if (icon_text == "wind") icon = "🌬";
            if (icon_text == "fog") icon = "🌫";
            if (icon_text == "partly-cloudy-night") icon = "🌑";
            if (icon_text == "clear-night") icon = "🌑";
            var daily_prec_chance = obj.daily.data[0].precipProbability;
            var daily_maxtemp = obj.daily.data[0].temperatureMax;
            var daily_mintemp = obj.daily.data[0].temperatureMin;
            $notification.post("Hanoi's weather", icon + " " + Math.round(daily_mintemp) + " - " + Math.round(daily_maxtemp) + "  ☔️ " + (Number(daily_prec_chance) * 100).toFixed(1)+ "%", hour_summary);        }
    });
}
