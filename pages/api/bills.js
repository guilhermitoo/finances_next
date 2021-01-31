import api from '../../lib/db.js';
import cors from 'nextjs-cors';

export default async (req, res) => {
    res.statusCode = 200;

    await cors(req, res, {
      // Options
      methods: ['GET'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });
    
    await api.get('/contas.json',{}).then(response => {
        res.json(response.data);
    });
  }
  