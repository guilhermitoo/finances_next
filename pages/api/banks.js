import api from '../../lib/db.js';

export default async (req, res) => {
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
                res.json(rsp);     
            } else {
                res.json([]);
            }
        });
    }
}