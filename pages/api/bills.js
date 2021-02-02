import api from '../../lib/db.js';

export default async (req, res) => {
    res.statusCode = 200;

    if (req.method === 'GET') {
    
        await api.get('/contas.json',{}).then(response => {
            response.data.sort(function(a,b) {
                return b.valor - a.valor;
            })
            res.json(response.data);
        });
    } else if ( (req.method === 'POST') ) {
        await api.post('/contas.json',req.body).then(response => {
            res.statusCode = response.statusCode;
            res.body = response.data;
        });
    }
  }
  