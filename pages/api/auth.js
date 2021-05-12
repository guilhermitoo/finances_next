import api from '../../lib/db.js';
import sjcl from '../../sjcl.js';
import jwt from 'jsonwebtoken';


async function credentialExists(uid,upx) {
    let ret = false;
    await api.get(`/credenciais.json`,{}).then(response => {
        let cred = {uid,upx};
        if (response.data) {            
            let creds = response.data.filter(function (el) {
                return el != null;
            });

            ret = creds.some( function (obj) {return (obj.uid == cred.uid) && (obj.upx == cred.upx)});
        } else { return false; }
    });
    return ret;
}

async function doAuthenticate(obj) {
    // let token = sjcl.hash.sha256.hash(uid);
    // let token = 'teste'+uid; 
    let token = jwt.sign(obj, 'secret', { algorithm: 'RS256' , expiresIn : '24h'});
    return {"token":token};
}

export default async (req, res) => {
    res.statusCode = 200;
    
    if (req.method === 'POST') {
        res.statusCode = 401;
        let uid = req.body.uid;
        let upx = req.body.upx;        

        if (await credentialExists(uid,upx)) {
            res.statusCode = 200;
            res.json(await doAuthenticate({uid,upx}));
        } else {
            res.statusCode = 401;
            res.json({"message": "Unautorized"});
        }
    }
}