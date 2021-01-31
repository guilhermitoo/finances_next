import api,{loadDB} from '../../lib/db.js';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
      // Only allow requests with GET, POST and OPTIONS
      methods: ['GET', 'POST', 'OPTIONS'],
    })
  )

export default async (req, res) => {
    res.statusCode = 200;

    await cors(req,res);
    
    // let db = loadDB().database();
    // return firebase.database().ref('/bills/').once('value').then((snapshot) => {
    //     res.json(snapshot);});    

    await api.get('/contas.json',{}).then(response => {
        res.json(response.data);
    });
  }
  