const express = require('express');
const app = express();

const { Datastore } = require('@google-cloud/datastore');
const bodyParser = require('body-parser');

const projectId = 'assignment-two-graytr-238221';
const datastore = new Datastore({projectId:projectId});

const SLIPS = "slip";
const BOATS = "boat";

const router = express.Router();

app.use(bodyParser.json());

//Id maker Length: 6
function newID() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    //console.log("\n"+id+"\n");
    return id;
}

//Get item
function fromDatastore(item){
    item.id = item[Datastore.KEY].id;
    return item;
}

/* ------------- Begin Lodging Model Functions ------------- */

//  //BOATS

//1 BOATS
function get_boats(){
	const boats = datastore.createQuery(BOATS);
	return datastore.runQuery(boats).then( (entities) => {
			return entities[0].map(fromDatastore);
		});
}

//2 BOATS
function post_boat(name, type, length){
    var key = datastore.key(BOATS);
	const new_boat = {"name": name, "type": type, "length": length};
	return datastore.save({"key":key, "data":new_boat}).then(() => {return key});
}

//3 BOATS
async function put_boat(id, body){
    //TODO: Make this replace things
    var boat_object = 0;
    //grab the current boat at id
    const boats = await get_boats();
	
    //console.log(boats);
    for(var num in boats){
        if(boats[num].id==id){
            //console.log(boats[num]);
            boat_object = boats[num];
            //console.log(boat_object);
        }
    }
    
    console.log(body.name);
    console.log(body.type);
    console.log(body.length);

    if (body.name==undefined) {
        name = boat_object.name;
    }
    else{
        number = body.name;
    }
    if (body.type==undefined) {
        type = boat_object.type;
    }
    else{
        type = body.type;
    }
    if (body.length==undefined) {
        length = boat_object.length;
    }
    else{
        length = body.length;
    }

    const key = datastore.key([BOATS, parseInt(id,10)]);
    const boat = {"name": name, "type": type, "length": length};
    return datastore.save({"key":key, "data":boat});
}

//4 BOATS
async function delete_boat(id){
    //TODO: check to see if Boat is in a boat and remove it and its arrival time.
    var slip_object = 0;

    //grab the current slip at id
    const slips = await get_slips();
	
    //console.log(slips);
    for(var num in slips){
        if(slips[num].current_boat==id){
            console.log(slips[num]);
            slip_object = slips[num];
            //console.log(slip_object);
            const key_slip = datastore.key([SLIPS, parseInt(slip_object.id,10)]);
            const UpdatedSlip = {"number": slip_object.number, "current_boat": null, "arrival_date": null};
            await datastore.save({"key":key_slip, "data":UpdatedSlip});
        }
    }

    const key = datastore.key([BOATS, parseInt(id,10)]);
    return datastore.delete(key);
}

//  //SLIPS

//1 SLIPS
function get_slips(){
	const slips = datastore.createQuery(SLIPS);
	return datastore.runQuery(slips).then( (entities) => {
			return entities[0].map(fromDatastore);
		});
}

//2 SLIPS
function post_slip(){
    var key = datastore.key(SLIPS);
	const new_slip = {"number": newID(), "current_boat": null, "arrival_date": null};
	return datastore.save({"key":key, "data":new_slip}).then(() => {return key});
}

//3 SLIPS
async function put_slip(id, body){
    //TODO: Make this replace things
    var slip_object = 0;

    //grab the current slip at id
    const slips = await get_slips();
	
    //console.log(slips);
    for(var num in slips){
        if(slips[num].id==id){
            //console.log(slips[num]);
            slip_object = slips[num];
            //console.log(slip_object);
        }
    }
    
    console.log(body.number);
    console.log(body.current_boat);
    console.log(body.arrival_date);

    if (body.number==undefined) {
        number = slip_object.number;
    }
    else{
        number = body.number;
    }
    if (body.current_boat==undefined) {
        current_boat = slip_object.current_boat;
    }
    else{
        current_boat = body.current_boat;
    }
    if (body.arrival_date==undefined) {
        arrival_date = slip_object.arrival_date;
    }
    else{
        arrival_date = body.arrival_date;
    }

    const key = datastore.key([SLIPS, parseInt(id,10)]);
    const slip = {"number": number, "current_boat": current_boat, "arrival_date": arrival_date};
    datastore.save({"key":key, "data":slip});
    return slip;
    
}

//4 SLIPS
function delete_slip(id){
    const key = datastore.key([SLIPS, parseInt(id,10)]);
    return datastore.delete(key);
}

// ------------- BOTH ---------------------------------------
//1 BOTH
async function modify_boat(slip_id, boat_id){
    //TODO: check if boat exists
    var boat_confirmed = 0;
    var boat_object = 0;
    const boats = await get_boats();
    //console.log(boats);
    for(var num in boats){
        if(boats[num].id==boat_id){
            //console.log(boats[num].id);
            boat_object = boats[num];
            boat_confirmed = 1;
            break;
        }
    }
    //TODO: check if slip exists
    var slip_confirmed = 0;
    var slip_confirmed_old = 0;
    var slip_object = 0;
    var slip_object_old = 0;
    const slips = await get_slips();
    console.log(slips);
    for(var num in slips){
        //Save slip the id of the 
        if(slips[num].id==slip_id){
            if(slips[num].current_boat!=null) {
                console.log("adsfsaf");
                var slip = 2;
                return slip;
            }
            slip_object = slips[num];
            slip_confirmed = 1;
        }
        //console.log(slips[num]);
        //Will update the slip if the boat is already occupying a slip.
        if(slips[num].current_boat==boat_id){
            console.log(slips[num].id);
            slip_object_old = slips[num];
            slip_confirmed_old = 1;
            //console.log(slip_object);
        }
    }

    //console.log(boat_confirmed);
    //console.log(boat_object.id);
    //console.log(slip_confirmed);
    //console.log(slip_object.id);

    //Triggers if boat exists and slip exists
    if(boat_confirmed==1 && slip_confirmed==1){
        //Triggers if the boats exists inside of another slip.
        if(slip_confirmed_old==1){

            //Replace slip [current_Boat,arrival_time] with [null,null]
            const key_slip = datastore.key([SLIPS, parseInt(slip_object_old.id,10)]);
            const UpdatedSlip = {"number": slip_object_old.number, "current_boat": null, "arrival_date": null};
            await datastore.save({"key":key_slip, "data":UpdatedSlip});
        }

        //console.log("Somehow got here: ");
        const key_slip = datastore.key([SLIPS, parseInt(slip_id,10)]);
        //console.log(key_slip);
        //const slip = {"current_boat": boat_id, "arrival_date": new Date()};
        var url = "https://assignment-two-graytr-238221.appspot.com/marina/boats/" + boat_id;
        const slip = {"number": slip_object.number, "current_boat": boat_object.id, "arrival_date": new Date(), "live_URL": url};
        datastore.save({"key":key_slip, "data":slip});
        return slip;
    }
    //console.log("Somehow got here next: ");
    return 0;
}

//2 BOTH
async function delete_modify_boat(slip_id, boat_id){
    //TODO: check if slip exists
    var slip_confirmed = 0;
    var slip_confirmed_old = 0;
    var slip_object = 0;
    var slip_object_old = 0;
    const slips = await get_slips();
    console.log(slips);
    for(var num in slips){
        //Save slip the id of the 
        if(slips[num].id==slip_id){
            console.log(slips[num].current_boat);

            if(slips[num].current_boat==boat_id) {
                console.log("adsfsaf");
                const key_slip = datastore.key([SLIPS, parseInt(slip_id,10)]);
                //console.log(key_slip);
                //const slip = {"current_boat": boat_id, "arrival_date": new Date()};
                const slip = {"number": slips[num].number, "current_boat": null, "arrival_date": null};
                datastore.save({"key":key_slip, "data":slip});
                return slip;
            }
        }
    }
    //console.log("Somehow got here next: ");
    return 0;
}
/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */

//  //BOATS

//1 BOATS
router.get('/boats', function(req, res){
    const boats = get_boats()
	.then( (boats) => {
        //console.log(boats);
        res.status(200).json(boats);
    });
});

//2 BOATS
router.get('/boats/:id', function(req, res){
    const boats = get_boats()
	.then( (boats) => {
        //console.log(boats);
        for(var num in boats){
            if(boats[num].id==req.params.id){
                res.status(200).json(boats[num]);
            }
        }
        res.status(405).json("No boat at this ID");
    });
});

//3 BOATS
router.post('/boats', function(req, res){
    console.log(req.body);
    post_boat(req.body.name, req.body.type, req.body.length, "At Sea")
    .then( key => {res.status(200).send('{ "id": ' + key.id + ' }')} );
});

//4 BOATS
router.put('/boats/:id', function(req, res){
    //put_boat(req.params.id, req.body).then(res.status(200).end());

    //console.log("asdfsdafdsaf");
    //put_boat(req.params.id, req.body).then(res.status(200).end());
    const boat = put_boat(req.params.id, req.body)
    .then( (boat) => {
        console.log("TESTING HERE: "+boat);
        if(boat!=0){
            //console.log("0 "+boat);
            res.status(200).json(boat).end();
        }
        else{
            //console.log("1 "+boat);
            res.status(405).json("/boats/id: | Your numbers were off!!").end();
        }
    });
});

//5 BOATS
router.delete('/boats/:id', function(req, res){
    const boats = get_boats()
	.then( (boats) => {
        console.log(boats);
        for(var num in boats){
            if(boats[num].id==req.params.id){
                delete_boat(req.params.id).then(res.status(200).json(boats[num]).end())
            }
        }
        res.status(405).json("No boat at this ID... no boat deleted");
    });
});

//  //SLIPS

//1 SLIPS
router.get('/slips', function(req, res){
    const slips = get_slips()
	.then( (slips) => {
        console.log(slips);
        res.status(200).json(slips);
    });
});

//2 SLIPS 
router.get('/slips/:id', function(req, res){
    const slips = get_slips()
	.then( (slips) => {
        console.log(slips);
        for(var num in slips){
            if(slips[num].id==req.params.id){
                res.status(200).json(slips[num]);
            }
        }
        res.status(405).json("No slip at this ID");
    });
});

//3 SLIPS
router.post('/slips', function(req, res){
    console.log(req.body);
    post_slip()
    .then( key => {res.status(200).send('{ "id": ' + key.id + ' }')} );
});

//4 SLIPS
router.put('/slips/:id', function(req, res){
    //console.log("asdfsdafdsaf");
    //put_slip(req.params.id, req.body).then(res.status(200).end());
    const slip = put_slip(req.params.id, req.body)
    .then( (slip) => {
        console.log("TESTING HERE: "+slip);
        if(slip!=0){
            //console.log("0 "+slip);
            res.status(200).json(slip).end();
        }
        else{
            //console.log("1 "+slip);
            res.status(405).json("/slips/id: | Your numbers were off!!").end();
        }
    });
});

//5 SLIPS
router.delete('/slips/:id', function(req, res){
    const slips = get_slips()
	.then( (slips) => {
        console.log(slips);
        for(var num in slips){
            if(slips[num].id==req.params.id){
                delete_slip(req.params.id).then(res.status(200).json(slips[num]).end())
            }
        }
        res.status(405).json("No slip at this ID... no slips deleted");
    });
});

// -------- BOTH --------------------
//1
router.put('/slips/:slip_id/boats/:boat_id', function(req, res){
    const slip = modify_boat(req.params.slip_id,req.params.boat_id).then( (slip) => {
        if(slip==2){
            console.log("0 "+slip);
            res.status(304).end();
        }
        else if(slip!=0){
            //console.log("0 "+slip);
            res.status(200).json(slip).end();
        }
        else{
            //console.log("1 "+slip);
            res.status(405).json("/slips/:slip_id/boats/:boat_id Your numbers were off!!").end();
        }
    });
    //res.status(200).json({"slip_id":req.params.slip_id,"boat_id":req.params.boat_id}).end()
});

//2
router.delete('/slips/:slip_id/boats/:boat_id', function(req, res){
    const slip = delete_modify_boat(req.params.slip_id,req.params.boat_id).then( (slip) => {
        if(slip!=0){
            console.log("0 "+slip);
            res.status(200).json(slip).end();
        }
        else{
            console.log("1 "+slip);
            res.status(405).json("delete /slips/:slip_id/boats/:boat_id ===> Boat not found in slip!!").end();
        }
    });
    //res.status(200).json({"slip_id":req.params.slip_id,"boat_id":req.params.boat_id}).end()
});
/* ------------- End Controller Functions ------------- */

app.use('/marina', router);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});