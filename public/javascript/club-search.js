//call to ZIP api here, send an array of nearby zips to a TBD route on the back end
//call to zipcode api, return array of local zip codes within x miles

async function getZIP(){
    console.log("searching...")
    const response = await fetch('/club-search',{
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
}
document.querySelector('#search-local-clubs').addEventListener('click', getZIP);