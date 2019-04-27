let formLat, formLong, formSubmit;

function main() {

    document.querySelector('#geolocate').addEventListener('click', geolocate);
    formLat = document.querySelector('#latitude');
    formLong = document.querySelector('#longitude');
    formSubmit = document.querySelector('#submit');

    formLong.addEventListener('input', checkSubmit);
    formLat.addEventListener('input', checkSubmit);
    checkSubmit(); // check once on init
}

function geolocate(e) {
    navigator.geolocation.getCurrentPosition(
        (data) => {
            let { latitude, longitude } = data.coords;
            [formLat.value, formLong.value] = [latitude, longitude];
            console.log(data);
        },
        console.error
    );
    checkSubmit();
}

function checkSubmit(e) {
    // debugger;
    // let {0: lat, 1: long} = document.forms.locationForm
    // console.log(formLat.value, formLong.value);
    console.log(+formLat.value);
    console.log(+formLong.value);
    if (
        formLat.value !== ''
        && !isNaN(+formLat.value)
        && formLong.value !== ''
        && !isNaN(+formLong.value)
    ) {
        formSubmit.disabled = false;
    } else {
        formSubmit.disabled = true;
    }
}


main();