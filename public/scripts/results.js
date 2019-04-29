
console.log(resultsData);

const hours = resultsData.hours.map(el => el.time); // LABELS

const todayDate = dateFns.format(new Date(), 'ha, ddd');
console.log(todayDate);

const baroPressure = {
  label: 'Barometric Pressure (hPa)',
  data: resultsData.hours.map(el => el.pressure), // DATA
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
      position: 'bottom',
      onClick: null
    },
    maintainAspectRatio: false,
    aspectRatio: 1.33,
    responsive: true,
    annotation: {
      drawTime: 'afterDatasetsDraw',
      events: [],
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: todayDate,
          borderColor: '#f02d3a',
          borderWidth: 2,
        }
      ]
    }
  }
});