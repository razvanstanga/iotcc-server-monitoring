var mqtt = require('mqtt');
var CR = require('command_runner');

var appOptions = require('./config.js');
var client  = mqtt.connect(appOptions.mqtt);

function run() {
   CR.exec("/bin/df | grep '^/dev/*'").then(function (res) {
        var lines = res.stdout.split("\n");
        for (line in lines) {
            var lineContent = lines[line];
            if (lineContent == "") {continue;}
            var hdd = lineContent.replace(/[ ]+/g, " ").replace(/G/g, "").split(' ');
            var used = parseInt(hdd[2] / 1024 / 1024),
                free = parseInt(hdd[3] / 1024 / 1024);
            var message = {
                "pageName": appOptions.pageName,
                "pageId": appOptions.pageId,
                "widget": "chart.js",
                "chart": "pie",
                "title": hdd[0],
                "topic": appOptions.prefix + appOptions.device + "/hdd" + line,
                "value": {"labels": ["GB Used", "GB Free"], "datasets": [{"data": [used, free], "backgroundColor": ["#d80f26", "#0eb722"], "hoverBackgroundColor": ["#d80f26", "#0eb722"]}]},
                "valuedescription": "",
                "template": "template-3",
                "icon": "fa fa-server",
                "class": "bg-green",
                "order": 100
            };
            client.publish(appOptions.prefix + appOptions.device + "/hdd" + line + "/config", JSON.stringify(message), {qos: 1, retain: 0});
        }
    });

    CR.exec("free -b | grep 'Mem'").then(function (res) {
        var mem = res.stdout.replace(/[ ]+/g, " ").split(' ');
        var used = parseInt(mem[2]  / 1024 / 1024),
            free = parseInt(mem[2]  / 1024 / 1024),
            cache = parseInt(mem[5]  / 1024 / 1024);
        var message = {
            "pageName": appOptions.pageName,
            "pageId": appOptions.pageId,
            "widget": "chart.js",
            "chart": "pie",
            "title": "Memory usage",
            "topic": appOptions.prefix + appOptions.device + "/ram",
            "value": {"labels": ["MB Used", "MB Free", "MB Cache"], "datasets": [{"data": [used, free, cache], "backgroundColor": ["#d80f26", "#0eb722", "#e09108"], "hoverBackgroundColor": [ "#d80f26", "#0eb722", "#e09108"]}]},
            "valuedescription": "",
            "template": "template-3",
            "icon": "fa fa-server",
            "class": "bg-green",
            "order": 300
        };
        client.publish(appOptions.prefix + appOptions.device + "/ram/config", JSON.stringify(message), {qos: 1, retain: 0});
    });

    CR.exec("free -b | grep 'Swap'").then(function (res) {
        var mem = res.stdout.replace(/[ ]+/g, " ").replace(/[\n]+/g, " ").split(' ');
        var used = parseInt(mem[2]  / 1024 / 1024),
            free = parseInt(mem[3]  / 1024 / 1024);
        var message = {
            "pageName": appOptions.pageName,
            "pageId": appOptions.pageId,
            "widget": "chart.js",
            "chart": "pie",
            "title": "Swap usage",
            "topic": appOptions.prefix + appOptions.device + "/swap",
            "value": {"labels": ["MB Used", "MB Free"], "datasets": [{"data": [used, free], "backgroundColor": ["#d80f26", "#0eb722"], "hoverBackgroundColor": [ "#d80f26", "#0eb722"]}]},
            "valuedescription": "",
            "template": "template-3",
            "icon": "fa fa-server",
            "class": "bg-green",
            "order": 400
        };
        client.publish(appOptions.prefix + appOptions.device + "/swap/config", JSON.stringify(message), {qos: 1, retain: 0});
    });

    CR.exec('uptime | awk -F\'( |,|:)+\' \'{print $6,$7",",$8,"hours,",$9,"minutes."}\'').then(function (res) {
        var message = {
            "pageName": appOptions.pageName,
            "pageId": appOptions.pageId,
            "widget": "data",
            "title": "Uptime",
            "topic": appOptions.prefix + appOptions.device + "/uptime",
            "value": res.stdout,
            "valuedescription": "",
            "template": "template-3",
            "icon": "fa fa-server",
            "class": "bg-green",
            "order": 20
        };
        client.publish(appOptions.prefix + appOptions.device + "/uptime/config", JSON.stringify(message), {qos: 1, retain: 0});
    });

    CR.exec('cat /proc/loadavg').then(function (res) {
        var load = parseFloat(res.stdout.split(' ')[0]);
        if (load < 1) {
            var color = 'bg-green';
        } else if (load >= 1 && load <= 1.5) {
            var color = 'bg-orange';
        } else {
            var color = 'bg-red';
        }
        var message = {
            "pageName": appOptions.pageName,
            "pageId": appOptions.pageId,
            "widget": "data",
            "title": "System load",
            "topic": appOptions.prefix + appOptions.device + "/sysload",
            "value": res.stdout,
            "valuedescription": "",
            "template": "template-3",
            "icon": "fa fa-server",
            "class": color,
            "order": 10
        };
        client.publish(appOptions.prefix + appOptions.device + "/sysload/config", JSON.stringify(message), {qos: 1, retain: 0});
    });

    CR.exec('mailq | grep -c "^[A-F0-9]"').then(function (res) {
        var emails = parseInt(res.stdout);
        if (emails < 100) {
            var color = 'bg-green';
        } else if (load >= 100 && load <= 200) {
            var color = 'bg-orange';
        } else {
            var color = 'bg-red';
        }
        var message = {
            "pageName": appOptions.pageName,
            "pageId": appOptions.pageId,
            "widget": "data",
            "title": "Postqueue emails",
            "topic": appOptions.prefix + appOptions.device + "/postqueue",
            "value": res.stdout,
            "valuedescription": "",
            "template": "template-3",
            "icon": "fa fa-server",
            "class": color,
            "order": 30
        };
        client.publish(appOptions.prefix + appOptions.device + "/postqueue/config", JSON.stringify(message), {qos: 1, retain: 0});
    });

    CR.exec("who").then(function (res) {
        var message = {
            "pageName": appOptions.pageName,
            "pageId": appOptions.pageId,
            "widget": "data",
            "title": "Logged in users",
            "topic": appOptions.prefix + appOptions.device + "/users",
            "value": res.stdout.replace(/\n/g, "<br />"),
            "valuedescription": "",
            "template": "template-3",
            "icon": "fa fa-server",
            "class": "bg-green",
            "order": 60
        };
        client.publish(appOptions.prefix + appOptions.device + "/users/config", JSON.stringify(message), {qos: 1, retain: 0});
    });
}
client.on('connect', () => {
	setInterval(function() {
        run();
    }, appOptions.interval);
    run();
});
