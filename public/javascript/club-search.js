
async function distanceSearchHandler(){
    console.log('load');
    const dist = $('#zip-distance').val()

    const response = await fetch('/api/club-search?dist=' + dist); 

    if (response.ok) {
        const clubData = await response.json();
        console.log(clubData);
    }
}

window.addEventListener('load', distanceSearchHandler);