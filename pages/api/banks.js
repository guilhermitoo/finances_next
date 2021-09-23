import api from '../../lib/db.js';
import { getSession } from 'next-auth/client'

export default async (req, res) => {
    const session = await getSession({ req })

    if (!session) {        
        res.statusCode = 401;
        res.send({ error: 'Unauthorized' });
    } else {
        
        let user = req.query.user;
        res.statusCode = 200;

        if (req.method === 'GET') {
            await api.get(`/bancos.json`,{}).then(response => {
            // await api.get(`/contas.json`,{}).then(response => {
                if (response.data) {
                    let rsp = Object.values(response.data);                
                    Object.keys(response.data).forEach((val,index,arr) => {
                        if (typeof rsp[index] === 'object') {
                            rsp[index].id = val;
                        }
                    });
                    rsp = rsp.filter(function(a) {
                        if (('usuario' in a) && (a.usuario === user)) {
                            return true;
                        }
                        else { return false; }                    
                    });
                    res.json(rsp);     
                } else {
                    res.json([]);
                }
            });
        }
    }
}