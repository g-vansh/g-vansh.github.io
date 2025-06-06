document.addEventListener('DOMContentLoaded', function() {
  // Check if the research focus chart container exists
  const chartElement = document.getElementById('researchFocusChart');
  if (!chartElement) return;

  // Get tag data from the element's data attributes if available
  // This will be populated by the jekyll template
  let labels = [];
  let counts = [];
  
  // If we're on a page where these tags are being counted by Jekyll
  if (window.publicationTagsData) {
    labels = window.publicationTagsData.labels;
    counts = window.publicationTagsData.counts;
  } 
  // Fallback to predefined data if no dynamic data is available
  else {
    console.log("No publication tag data found, using fallback data");
    labels = [
      'Innovation Economics',
      'Open Source Software',
      'Strategy',
      'Urban Economics',
      'Development Economics',
      'Education Economics',
      'Public Economics',
      'Environmental Economics'
      ];
    counts = [23, 8, 12, 7, 16, 14, 12, 8];
  }

  // Generate colors array for available tags
  const generateColors = (count) => {
    const baseColors = [
      [54, 162, 235],   // blue
      [75, 192, 192],   // teal
      [255, 159, 64],   // orange
      [153, 102, 255],  // purple
      [255, 99, 132],   // pink
      [255, 206, 86],   // yellow
      [46, 204, 113],   // green
      [52, 73, 94],     // dark blue
      [231, 76, 60],    // red
      [155, 89, 182]    // lavender
    ];
    
    const backgroundColors = [];
    const borderColors = [];
    
    for (let i = 0; i < count; i++) {
      const color = baseColors[i % baseColors.length];
      backgroundColors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.7)`);
      borderColors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);
    }
    
    return { backgroundColors, borderColors };
  };

  const { backgroundColors, borderColors } = generateColors(labels.length);

  // Determine if we're on a mobile device
  const isMobile = window.innerWidth < 768;

  // Research focus areas data
  const data = {
    labels: labels,
    datasets: [{
      label: 'Research Focus',
      data: counts,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1,
      hoverOffset: isMobile ? 10 : 15
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
          position: isMobile ? 'bottom' : 'right',
          align: isMobile ? 'center' : 'start',
          labels: {
            boxWidth: isMobile ? 12 : 15,
            padding: isMobile ? 10 : 20,
            font: {
              family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              size: isMobile ? 10 : 12
            },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      cutout: isMobile ? '70%' : '60%'
    }
  });

  // Add hover effect
  chartElement.addEventListener('mouseover', function() {
    chartElement.style.filter = 'drop-shadow(0px 0px 8px rgba(0, 123, 255, 0.4))';
  });
  
  chartElement.addEventListener('mouseout', function() {
    chartElement.style.filter = 'none';
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const chart = Chart.getChart(chartElement);
    if (chart) {
      const isMobileNow = window.innerWidth < 768;
      chart.options.plugins.legend.position = isMobileNow ? 'bottom' : 'right';
      chart.options.plugins.legend.align = isMobileNow ? 'center' : 'start';
      chart.options.plugins.legend.labels.boxWidth = isMobileNow ? 12 : 15;
      chart.options.plugins.legend.labels.padding = isMobileNow ? 10 : 20;
      chart.options.plugins.legend.labels.font.size = isMobileNow ? 10 : 12;
      chart.options.cutout = isMobileNow ? '70%' : '60%';
      chart.update();
    }
  });
}); 