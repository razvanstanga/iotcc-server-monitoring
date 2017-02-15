var mqtt = require('mqtt');
var CR = require('command_runner');

var options = {
	clientId:'web1-server',
	username:'',
	password:'',
	host: '',
	port: ''
};
var client  = mqtt.connect(options);

client.on('connect', () => {
	setInterval(function(){

            CR.exec('uptime | awk -F\'( |,|:)+\' \'{print $6,$7",",$8,"hours,",$9,"minutes."}\'').then(function (res) {
                var message = {
                        "pageName": "web1",
                        "pageId": "1000",
                        "widget":"data",
                        "title":"Uptime",
                        "topic":"/iotcc/web1/uptime",
                        "value": res.stdout,
                        "valuedescription": "",
                        "template": "template-3",
                        "icon": "fa fa-server",
                        "class": "bg-green",
                        "order": 20
                };
                client.publish('/iotcc/web1/uptime/config', JSON.stringify(message), {qos: 1, retain: 0});
    	    });

	    CR.exec('cat /proc/loadavg').then(function (res) {
                var message = {
                        "pageName": "web1",
                        "pageId": "1000",
                        "widget":"data",
                        "title":"System load",
                        "topic":"/iotcc/web1/sysload",
                        "value": res.stdout,
                        "valuedescription": "",
                        "template": "template-3",
                        "icon": "fa fa-server",
                        "class": "bg-green",
                        "order": 10
                };
                client.publish('/iotcc/web1/sysload/config', JSON.stringify(message), {qos: 1, retain: 0});
            });

            CR.exec('mailq | grep -c "^[A-F0-9]"').then(function (res) {
                var message = {
                        "pageName": "web1",
                        "pageId": "1000",
                        "widget":"data",
                        "title":"Postqueue emails",
                        "topic":"/iotcc/web1/postqueue",
                        "value": res.stdout,
                        "valuedescription": "",
                        "template": "template-3",
                        "icon": "fa fa-server",
                        "class": "bg-green",
                        "order": 30
                };
                client.publish('/iotcc/web1/postqueue/config', JSON.stringify(message), {qos: 1, retain: 0});
            });

            CR.exec('free -h | grep -v +').then(function (res) {
                var message = {
                        "pageName": "web1",
                        "pageId": "1000",
                        "widget":"data",
                        "title":"Memory usage",
                        "topic":"/iotcc/web1/ram",
                        "value": res.stdout.replace(/\n/g, "<br />"),
                        "valuedescription": "",
                        "template": "template-3",
                        "icon": "fa fa-server",
                        "class": "bg-green",
                        "order": 40
                };
                client.publish('/iotcc/web1/ram/config', JSON.stringify(message), {qos: 1, retain: 0});
            });

            CR.exec("/bin/df -h| grep 'Filesystem\\|/dev/sd*'").then(function (res) {
                var message = {
                        "pageName": "web1",
                        "pageId": "1000",
                        "widget":"data",
                        "title":"HDD usage",
                        "topic":"/iotcc/web1/hdd",
                        "value": res.stdout.replace(/\n/g, "<br />"),
                        "valuedescription": "",
                        "template": "template-3",
                        "icon": "fa fa-server",
                        "class": "bg-green",
                        "order": 50
                };
                client.publish('/iotcc/web1/hdd/config', JSON.stringify(message), {qos: 1, retain: 0});
            });

            CR.exec("who").then(function (res) {
                var message = {
                        "pageName": "web1",
                        "pageId": "1000",
                        "widget":"data",
                        "title":"Logged in users",
                        "topic":"/iotcc/web1/users",
                        "value": res.stdout.replace(/\n/g, "<br />"),
                        "valuedescription": "",
                        "template": "template-3",
                        "icon": "fa fa-server",
                        "class": "bg-green",
                        "order": 60
                };
                client.publish('/iotcc/web1/users/config', JSON.stringify(message), {qos: 1, retain: 0});
            });

        }, 10000);

});
