//call to ZIP api here, send an array of nearby zips to a TBD route on the back end



//call to zipcode api, return array of local zip codes within x miles

const key = process.env.ZIP_API_KEY;//TODO change this reference to the heroku one before live
const userZIP = 0;
//call user GET using session user id to get ZIP
const getZIP = async function() {
    const fetchStr = '/api/users/' + req.session.user_id
    const response = await fetch(fetchStr, (req, res),{
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
        console.log(response.zipcode);
        userZIP = response.zipcode;
    } else {
        alert(response.statusText);
    }
};
getZIP();