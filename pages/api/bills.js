import api from '../../lib/db.js';

export default async (req, res) => {
    res.statusCode = 200;
    
    await api.get('/contas.json',{}).then(response => {
        response.data.sort(function(a,b) {
            return b.valor - a.valor;
        })
        res.json(response.data);
    });
  }
  