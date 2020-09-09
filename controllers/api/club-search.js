const router = require('express').Router();
//const session = require('express-session');
const fetch = require("node-fetch");
const sequelize = require('../../config/connection');
const { Op } = require('sequelize');
const { User, ClubMember, Club } = require('../../models')

router.get('/', (req, res) => {
    async function returnData() {
        const zipcode = req.session.zipcode;
        const dist = req.query.dist;
        let nearbyZIPs =[];
        console.log(zipcode, dist);
        let zipSearchURL = "https://www.zipcodeapi.com/rest/" + process.env.ZIP_API_KEY + "/radius.json/"
            + zipcode + "/" + dist + "/mile"

        // API call format: https://www.zipcodeapi.com/rest/<api_key>/radius.<format>/<zip_code>/<distance>/<units>
        let zipAPICall = await fetch(zipSearchURL, { mode: 'cors' })
        switch (zipAPICall.status){
            case 429: console.log("\nToo many requests for our peasant key. Wait a bit.\n"); break;
            case 404: console.log("\nZIP code not found.\n"); break;
            case 400: console.log("\nRequest format didn't work.\n"); break;
            case 401: console.log("\nAPI key isn't valid.\n"); break;
            default:
                await zipAPICall.json().then(res => {
                    //test response (I reached the api call limit REAL quick.)
                    //const response = { "zip_codes": [{ "zip_code": "54128", "distance": 45.68, "city": "Gresham", "state": "WI" }, { "zip_code": "54416", "distance": 45.139, "city": "Bowler", "state": "WI" }, { "zip_code": "54135", "distance": 44.487, "city": "Keshena", "state": "WI" }, { "zip_code": "54471", "distance": 48.94, "city": "Ringle", "state": "WI" }, { "zip_code": "54414", "distance": 42.027, "city": "Birnamwood", "state": "WI" }, { "zip_code": "54150", "distance": 37.323, "city": "Neopit", "state": "WI" }] }
                    nearbyZIPs = res.zip_codes.map(value => { return value.zip_code })
                })
                console.log("here are the zip codes near " + zipcode.toString() + ":");
                console.log(nearbyZIPs);

                const response = await Club.findAll({
                    include: {
                        model: User,
                        as: "members",
                        where: {
                            zipcode: {
                                [Op.or]: nearbyZIPs
                            }
                        }
                    }
                });

                if (response.ok) {
                    if (!response.length) {
                        console.log(err);
                        res.status(404).json(err);
                        return;
                    }
                    res.json(response);
                } else {
                    console.log(err);
                    res.status(500).json(err);
                }    
        }
    }
});

module.exports = router;
