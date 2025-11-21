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

  // Generate colors array using theme accent colors
  const generateColors = (count) => {
    // Theme colors matching the dark kinetic theme
    const themeColors = [
      [155, 255, 31],   // #9bff1f - primary accent (neon green)
      [123, 235, 25],   // #7beb19 - accent hover
      [98, 255, 198],   // #62ffc6 - cyan accent
      [86, 255, 198],   // #56ffc6 - cyan variant
      [179, 255, 71],   // #b3ff47 - lighter green
      [99, 255, 157],   // #63ff9d - accent strong
      [155, 255, 49],   // #9bff31 - green variant
      [200, 255, 120],  // #c8ff78 - light green
      [120, 255, 80],   // #78ff50 - bright green
      [70, 255, 150]    // #46ff96 - mint green
    ];
    
    const backgroundColors = [];
    const borderColors = [];
    
    for (let i = 0; i < count; i++) {
      const color = themeColors[i % themeColors.length];
      // Use theme colors with appropriate opacity
      backgroundColors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`);
      borderColors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`);
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
              family: "'Azeret Mono', 'JetBrains Mono', 'Space Mono', monospace",
              size: isMobile ? 10 : 12,
              weight: '500'
            },
            usePointStyle: true,
            pointStyle: 'circle',
            color: 'rgba(241, 255, 233, 0.85)'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(6, 19, 12, 0.95)',
          borderColor: 'rgba(155, 255, 31, 0.4)',
          borderWidth: 1,
          titleColor: '#9bff1f',
          bodyColor: 'rgba(241, 255, 233, 0.9)',
          padding: 12,
          titleFont: {
            family: "'Azeret Mono', 'JetBrains Mono', monospace",
            size: 13,
            weight: '600'
          },
          bodyFont: {
            family: "'Azeret Mono', 'JetBrains Mono', monospace",
            size: 12
          },
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

  // Add hover effect with theme colors
  chartElement.addEventListener('mouseover', function() {
    chartElement.style.filter = 'drop-shadow(0px 0px 12px rgba(155, 255, 31, 0.4))';
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