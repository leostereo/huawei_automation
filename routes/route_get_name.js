const axios = require('axios')
var my_response;

module.exports = function(app) {

    app.get('/get_name', function(req, res) {

        console.log(req.query.sn);
        const sn = req.query.sn;

	try{
			axios
			.get('https://tecnetmza.smartolt.com/api/onu/get_onu_details/'+sn, {
				headers: {
				'X-Token': 'ef67c302d58e44f7b8e79a694cd0c1b5'
				}
			})
			.then(response => {
			console.log(response.data);
				if(response.data.status){
					res.status(200).send(response.data.onu_details.name)
				}else{
					res.status(404).send('ver logs,algo salio mal');
				}
            })
            .catch(function(error) {
                console.log(error);
                res.status(400).send('la onu  no se encuentra');
            })


	}catch(e){
	
        console.log("smartolt: "+e.message);
	res.status(500).send(response.data)
	}

}); //fin get

}