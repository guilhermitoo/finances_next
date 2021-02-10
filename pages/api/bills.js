import api from '../../lib/db.js';

export default async (req, res) => {
    res.statusCode = 200;
    // console.log(req.query.month);
    let month = req.query.month;

    if (req.method === 'GET') {
    
        await api.get(`/contas/${month}.json`,{}).then(response => {
        // await api.get(`/contas.json`,{}).then(response => {
            if (response.data) {
                let rsp = Object.values(response.data);                
                Object.keys(response.data).forEach((val,index,arr) => {
                    if (typeof rsp[index] === 'object') {
                        rsp[index].id = val;
                    }
                });
                rsp.sort(function(a,b) {
                    return b.valor - a.valor;
                });
                // rsp.forEach((currentValue,index,arr) => {
                //     currentValue.id = index+1;
                // });
                res.json(rsp);     
                // res.json(response.data);
                //AJEITAR PARA CADASTRAR COM POST E EDITAR COM PATCH UTILIZANDO A CHAVE GERADA
            } else {
                res.json([]);
            }
        });
    } else if ( (req.method === 'POST') ) {
        await api.post(`/contas/${month}.json`,req.body).then(response => {
            res.statusCode = response.statusCode;
            res.body = response.data;
        });
    } else if ( (req.method === 'PATCH') ) {
        let id = req.body.id;
        console.log(req.body);
        await api.patch(`/contas/${month}/${id}.json`,req.body).then(response => {
            res.statusCode = response.statusCode;
            res.body = response.data;
        });
    }
  }
  