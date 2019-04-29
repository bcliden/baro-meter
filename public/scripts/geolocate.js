let formLat, formLong, formSubmit, formLocate;

function main() {
  formLat = document.querySelector('#latitude');
  formLong = document.querySelector('#longitude');
  formSubmit = document.querySelector('#submit');
  formLocate = document.querySelector('#geolocate');

  formLocate.addEventListener('click', geolocate);
  formLong.addEventListener('input', checkSubmit);
  formLat.addEventListener('input', checkSubmit);
  checkSubmit(); // check once on init
}

function geolocate(e) {
  // get user location from browser!
  toggleLoading();
  navigator.geolocation.getCurrentPosition(
    (data) => {
      let { latitude, longitude } = data.coords;
      [formLat.value, formLong.value] = [latitude.toFixed(5), longitude.toFixed(5)];
      toggleLoading();
      checkSubmit(); // check once data is filled
    },
    (err) => {
      alert('Geolocation failed. Please enter manually or give permission.');
      console.error(err);
      toggleLoading();
      checkSubmit();
    }
  );
}

function checkSubmit(e) {
  // validate inputs, enable submit if they are ok
  // looking for: numbers only.
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

function toggleLoading () {
  // hide icon, show loading (plus aria span). or vice versa
  let locationIcon = formLocate.querySelector('i');
  let loadingIcons = formLocate.querySelectorAll('span');
  locationIcon.style.display = locationIcon.style.display === 'none' ? 'inherit' : 'none';
  loadingIcons.forEach(el => {
    el.style.display = el.style.display === 'none' ? 'inherit' : 'none';
  });
}

main();