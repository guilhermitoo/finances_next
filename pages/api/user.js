export default async (req, res) => {
    res.statusCode = 200;

    // por enquanto desativado
    return

    if (req.method === 'GET') {
    
        await api.get(`/credenciais.json`,{}).then(response => {
        // await api.get(`/contas.json`,{}).then(response => {
            if (response.data) {
                let rsp = response.data.filter(function (el) {
                    return el != null;
                });                
                res.json(rsp);     
            } else {
                res.json([]);
            }
        });
    } else if ( (req.method === 'POST') ) {
        await api.post(`/credenciais.json`,req.body).then(response => {
            res.status(response.status).json(response.data);
        });
    } else if ( (req.method === 'PATCH') ) {
        let id = req.body.id;
        await api.patch(`/credenciais/${id}.json`,req.body).then(response => {
            res.status(response.status).json(response.data);
        });
    } else if ( (req.method === 'DELETE') ) {
        let id = req.query.id;
        await api.delete(`/credenciais/${id}.json`,{}).then(response => {
            res.status(response.status).json(response.data);
        });
    }
  }