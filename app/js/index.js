'use strict';

let snmp = require('snmp-native');
let HOST = '192.168.0.1';
let session;

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
    let OID = '.1.3.6.1.2.1.4.3.0';

    let data = new Array();
    let temp = {
        ipNo: '無法取得',
        inRcv: 0
    }
    for (let i = 0; i < 8; i++) {
        data.push(temp);
    }


    // get port table
    for (let i = 0; i < 8; i++) {
        session.get({ oid: OID }, (error, result) => {
            data[i].inRcv = result[0].value;
        });
    }


    $('.portTable').empty();
    for (let i = 0; i < 8; i++) {
        $('.portTable').append(
            `<li>
                <div class="collapsible-header">Port ${i + 1}</div>
                <div class="collapsible-body">
                    <p>IP位置: ${data[i].ipNo}</p>
                    <p>${data[i].inRcv}</p>
                </div>
             </li>`);
    }
}

function startUp() {
    document.getElementById('connectHost').style.display = '';
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('hostIP').value = HOST;
}

function connectHost() {
    session = new snmp.Session({ host: HOST, community: 'public' })

    document.getElementById('mainPage').style.display = '';
    document.getElementById('connectHost').style.display = 'none';

    overview();
    portInfo();
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