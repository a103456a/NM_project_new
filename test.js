let snmp = require('snmp-native');
let HOST = '192.168.1.254';
let session = new snmp.Session({ host: HOST, community: 'public' });


for (let i = 1; i <= 8; i++) {
    let oids = [
        '.1.3.6.1.2.1.2.2.1.3.' + i.toString(),
        '.1.3.6.1.2.1.2.2.1.5.' + i.toString()
    ];
    console.dir(oids)
    session.getAll({ oids: oids }, function (error, varbinds) {
        console.dir(varbinds)

        varbinds.forEach(function (vb) {
            console.log(vb.oid + ' = ' + vb.value + ' (' + vb.type + ')');
        });
    });
}