import api,{loadDB} from '../../lib/db.js';

export default async (req, res) => {
    res.statusCode = 200;
    
    // let db = loadDB().database();
    // return firebase.database().ref('/bills/').once('value').then((snapshot) => {
    //     res.json(snapshot);});    

    await api.get('/contas.json',{}).then(response => {
        res.json(response.data);
    });
  }
  