import { resolveHref } from 'next/dist/next-server/lib/router/router';
import api from '../../lib/db.js';
import sjcl from '../../sjcl.js';


async function credentialExists(uid,upx) {
    await api.get(`/credenciais.json`,{}).then(response => {
        let cred = {uid,upx};
        if (response.data) {            
            let creds = response.data.filter(function (el) {
                return el != null;
              });

            let r = creds.some( function (obj) {return obj.uid == '1@gmail.com'});
            
            if (r) {
                return true;
            } else 
            {
                return false;
            }
            
        } else { return false; }
    });
}

function doAuthenticate(uid) {
    // let token = sjcl.hash.sha256(uid);
    let token = 'teste'+uid; 
    return {token};
}

export default async (req, res) => {
    res.statusCode = 200;
    
    if (req.method === 'POST') {
        res.statusCode = 401;
        let uid = req.body.uid;
        let upx = req.body.upx;        
    
        console.log(await credentialExists(uid,upx));

        if (true) {
            res.statusCode = 200;
            res.json(doAuthenticate(uid));
        } else {
            res.statusCode = 401;
            res.json({"message": "Unautorized"});
        }

    }
}