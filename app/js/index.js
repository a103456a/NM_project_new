'use strict';


let snmp = require('./../utilities/snmp.js');

snmp.get('.1.3.6.1.2.1.1.3.0', '120.107.172.237')
    .then((result) => {
        var upt = document.getElementById('uptime');
        upt.innerText = upTime(result[0].value);

        let q = result[0].value;
        window.setInterval(() => {
            q += 100
            upt.innerText = upTime(q)
        }, 1000);
    });


const ipc = require('electron').ipcRenderer;
let closeEl = document.getElementById('close');
closeEl.addEventListener('click', function () {
    ipc.send('close-main-window');
});


function upTime(timeTick) {
    timeTick /= 100;

    let time = [0, 0, 0, 0]; // days, hours, mins, seconds

    time[0] = Math.floor(timeTick / 86400);
    time[1] = Math.floor(timeTick % 86400 / 3600);
    time[2] = Math.floor(timeTick % 3600 / 60);
    time[3] = Math.floor(timeTick % 60);

    return `${time[0]} 日 ${time[1]} 時 ${time[2]} 分 ${time[3]} 秒`;
}