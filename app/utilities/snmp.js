'use strict'

let snmp = require('snmp-native');

function get(OID, HOST) {
    return new Promise((resolve, reject) => {
        var session = new snmp.Session({ host: HOST, community: 'public' });

        session.get({ oid: OID }, (error, varbinds) => {
            if (error) {
                console.log('Fail :(');
                reject(new Error(err));
            } else {
                console.log(varbinds[0].oid + ' = ' + varbinds[0].value + ' (' + varbinds[0].type + ')');
                resolve(varbinds);
            }

            session.close();
        });
    });
}

module.exports = {
    get: get
};