const router = require('express').Router();
//const session = require('express-session');
const fetch = require("node-fetch");

router.get('/', async (req, res) => {
    const zipcode = req.session.zipcode;
    const dist = "5";//TODO make this like a user-selectable option or something.
    let nearbyZIPs =[];
    let zipSearchURL = "https://www.zipcodeapi.com/rest/" + process.env.ZIP_API_KEY + "/radius.json/"
        + zipcode + "/" + dist + "/mile"

    // API call format: https://www.zipcodeapi.com/rest/<api_key>/radius.<format>/<zip_code>/<distance>/<units>
    let dummy = await fetch(zipSearchURL, { mode: 'cors' })
    switch (dummy.status){
        case 429: console.log("\nToo many requests for our peasant key. Wait a bit.\n"); break;
        case 404: console.log("\nZIP code not found.\n"); break;
        case 400: console.log("\nRequest format didn't work.\n"); break;
        case 401: console.log("\nAPI key isn't valid.\n"); break;
        default:
            await dummy.json().then(res => {
                //test response (I reached the api call limit REAL quick.)
                //const response = { "zip_codes": [{ "zip_code": "54128", "distance": 45.68, "city": "Gresham", "state": "WI" }, { "zip_code": "54416", "distance": 45.139, "city": "Bowler", "state": "WI" }, { "zip_code": "54135", "distance": 44.487, "city": "Keshena", "state": "WI" }, { "zip_code": "54471", "distance": 48.94, "city": "Ringle", "state": "WI" }, { "zip_code": "54414", "distance": 42.027, "city": "Birnamwood", "state": "WI" }, { "zip_code": "54150", "distance": 37.323, "city": "Neopit", "state": "WI" }] }
                nearbyZIPs = res.zip_codes.map(value => { return value.zip_code })
                //console.log(nearbyZIPs)
            })
            console.log("here are the zip codes near " + zipcode.toString() + ":");
            console.log(nearbyZIPs);
            
            break;
    }
});
module.exports = router;
