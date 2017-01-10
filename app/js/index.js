'use strict';

let snmp = require('snmp-native');
let timeOut = 10000;
let HOST = '192.168.1.254';
let session = null;


let ifType = ['other', 'regular1822', 'hdh1822', 'ddn-x25', 'rfc877-x25', 'ethernet-csmacd', 'iso88023-csmacd',
    'iso88024-tokenBus', 'iso88025-tokenRing', 'iso88026-man', 'starLan', 'proteon-10Mbit',
    'proteon-80Mbit', 'hyperchannel', 'fddi', 'lapb', 'sdlc', 'ds1', 'e1', 'basicISDN', 'primaryISDN',
    'propPointToPointSerial', 'ppp', 'softwareLoopback', 'eon', 'ethernet-3Mbit', 'nsip', 'slip',
    'ultra', 'ds3', 'sip', 'frame-relay'];


// main process
startUp();

// action listeners
const ipc = require('electron').ipcRenderer;

let closeEl = document.getElementById('close');
closeEl.addEventListener('click', function () {
    ipc.send('close-main-window');
});

let showHostName = document.getElementById('showHostName');
showHostName.addEventListener('click', function () {
    document.getElementById('edit-hostName').style.display = '';
    document.getElementById('editHostName').style.display = '';

    let dvcName = document.getElementById('deviceName');
    dvcName.style.display = 'none';

    document.getElementById('showHostName').style.display = 'none';
});

let editHostName = document.getElementById('editHostName');
editHostName.addEventListener('click', function () {
    let dvcName = document.getElementById('edit-hostName');

    session.set({ oid: '.1.3.6.1.2.1.1.5.0', value: dvcName.value, type: 4 }, (error, result) => {
        if (!error) {
            alert('修改成功!');
            overview();
        } else {
            alert('修改失敗，請再試一次');
        }
    });
});

let submitHostIP = document.getElementById('submitHostIP');
submitHostIP.addEventListener('click', function () {
    HOST = document.getElementById('hostIP').value;
    connectHost();
});

let reconnect = document.getElementById('reconnect');
reconnect.addEventListener('click', function () {
    startUp();
});


// utility functions
// initialize overview
function overview() {
    // show agent IP
    let showIP = document.getElementById('showIP');
    showIP.innerText = HOST;

    // get model name
    session.get({ oid: '.1.3.6.1.2.1.1.1.0' }, (error, result) => {
        let mdlName = document.getElementById('modelName');
        mdlName.innerText = result[0].value;
    });

    // get device name
    session.get({ oid: '.1.3.6.1.2.1.1.5.0' }, (error, result) => {
        document.getElementById('showHostName').style.display = '';
        document.getElementById('editHostName').style.display = 'none';


        let editName = document.getElementById('edit-hostName');
        editName.style.display = 'none';

        let dvName = document.getElementById('deviceName');
        dvName.style.display = '';
        dvName.innerText = result[0].value;
        editName.value = result[0].value;
    });


    // get agent MAC address
    session.get({ oid: '.1.3.6.1.2.1.2.2.1.6.1' }, (error, result) => {
        var macAddr = document.getElementById('showMAC');
        macAddr.innerText = result[0].valueHex.toString();
    });

    // total number of input datagrams received from interfaces
    session.get({ oid: '.1.3.6.1.2.1.4.3.0' }, (error, result) => {
        var show = document.getElementById('showRcv');
        show.innerText = result[0].value;
    });

    // get system up time
    session.get({ oid: '.1.3.6.1.2.1.1.3.0' }, (error, result) => {
        var upt = document.getElementById('uptime');
        upt.innerText = upTime(result[0].value);

        let q = result[0].value;
        window.setInterval(() => {
            q += 100;
            upt.innerText = upTime(q);
        }, 1000);
    });
}

// initialize port information
function portInfo() {
    $('.portTable').empty();
    // get port table
    for (let i = 1; i <= 8; i++) {
        // ifType
        // ifSpeed
        let oids = [
            '.1.3.6.1.2.1.2.2.1.3.' + i.toString(),
            '.1.3.6.1.2.1.2.2.1.5.' + i.toString(),
            '.1.3.6.1.2.1.2.2.1.8.' + i.toString()
        ];

        session.getAll({ oids: oids }, function (error, varbinds) {
            $('.portTable').append(
                `<li>
                    <div class="collapsible-header green lighten-1">Port ${i}</div>
                    <div class="collapsible-body grey lighten-4">
                        <div class="row">
                            <div class="col s10 m10 l10 offset-s1 offset-m1 offset-l1">
                                <table class="bordered centered">
                                    <thead>
                                        <tr>
                                            <th>屬性</th>
                                            <th>數值</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>介面型態</td>
                                            <td>${ifType[varbinds[0].value - 1]}</td>
                                        </tr>
                                        <tr>
                                            <td>傳輸速度</td>
                                            <td>${varbinds[1].value / 1000000} Mbps</td>
                                        </tr>
                                        <tr>
                                            <td>運作狀態</td>
                                            <td ${(varbinds[2].value) ? '' :'class=\"red-text text-darken-2\"'}>${varbinds[2].value ? '啟用' : '停用'}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row">
                            <div>
                                <a id="${i}enable" class="waves-effect waves-light light-green btn">啟用</a>
                                <a id="${i}disable" class="waves-effect waves-light red btn">停用</a>
                            </div>
                        </div>
                    </div>
                </li>`);
        });
    }
}

function startUp() {
    document.getElementById('connectHost').style.display = '';
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('preLoader').style.display = 'none';
    document.getElementById('hostIP').value = HOST;
}

function connectHost() {
    session = new snmp.Session({ host: HOST, community: 'public' });

    document.getElementById('connectHost').style.display = 'none';
    document.getElementById('preLoader').style.display = '';

    try {
        overview();
        portInfo();
    } catch (err) {
        startUp();
        alert("無法連上裝置，請再試一次");
        throw new Error(err);
    }

    
    document.getElementById('mainPage').style.display = '';
    document.getElementById('preLoader').style.display = 'none';
}


function upTime(timeTick) {
    timeTick /= 100;

    let time = [0, 0, 0, 0]; // days, hours, mins, seconds

    time[0] = Math.floor(timeTick / 86400);
    time[1] = Math.floor(timeTick % 86400 / 3600);
    time[2] = Math.floor(timeTick % 3600 / 60);
    time[3] = Math.floor(timeTick % 60);

    return `${time[0]} 日 ${time[1]} 小時 ${time[2]} 分 ${time[3]} 秒`;
}