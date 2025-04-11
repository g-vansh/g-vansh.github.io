document.addEventListener('DOMContentLoaded', function() {
  // Check if the research focus chart container exists
  const chartElement = document.getElementById('researchFocusChart');
  if (!chartElement) return;

  // Research focus areas data
  const data = {
    labels: [
      'Innovation Economics',
      'Urban Economics',
      'Development Economics',
      'Geneoeconomics',
      'Neuroeconomics',
      'Industrial Organization'
    ],
    datasets: [{
      label: 'Research Focus',
      data: [38, 25, 20, 7, 5, 5],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1,
      hoverOffset: 15
    }]
  };

  // Create the chart
  new Chart(chartElement, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              size: 12
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed + '%';
              return label;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      cutout: '60%'
    }
  });

  // Add hover effect
  chartElement.addEventListener('mouseover', function() {
    chartElement.style.filter = 'drop-shadow(0px 0px 8px rgba(0, 123, 255, 0.4))';
  });
  
  chartElement.addEventListener('mouseout', function() {
    chartElement.style.filter = 'none';
  });
}); 