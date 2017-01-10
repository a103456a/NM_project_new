let snmp = require('snmp-native');
let HOST = '192.168.1.254';
let session = new snmp.Session({ host: HOST, community: 'public' });



session.get({ oid: '.1.3.6.1.2.1.2.2.1.8.7' }, function (error, varbinds) {
    varbinds.forEach(function (vb) {
        console.log(vb.oid + ' = ' + vb.value + ' (' + vb.type + ')');
    });
});