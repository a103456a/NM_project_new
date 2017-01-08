import React from 'react';
import Snmp from 'snmp-native';

export class getOID extends React.Component {
    render() {
        function get(OID, HOST) {
            return new Promise((resolve, reject) => {
                var session = new Snmp.Session({ host: HOST, community: 'public' });

                session.get({ oid: OID }, (error, varbinds) => {
                    if (error) {
                        console.log('Fail :(');
                        reject(new Error(err));
                    } else {
                        console.log(varbinds[0].oid + ' = ' + varbinds[0].value + ' (' + varbinds[0].type + ')');
                        resolve(varvinds);
                    }

                    session.close();
                });
            });
        }
    }
}