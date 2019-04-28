
  console.log(resultsData);

  const days = resultsData.days;
  const hours = resultsData.hours;

  const baroPressure = {
    label: 'Barometric Pressure (hPa)',
    data: resultsData.hourPressure,
    backgroundColor: 'rgba(89, 165, 216, .3)',
    borderColor: 'rgba(89, 165, 216, 1)',
    pointRadius: 0,
    pointHitRadius: 10
  }

  var ctx = document.getElementById('baroChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        baroPressure,
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        position: 'bottom'
      },
      maintainAspectRatio: false,
      aspectRatio: 1.33,
      responsive: true,
    }
  });