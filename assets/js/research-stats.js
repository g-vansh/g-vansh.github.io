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

  // Generate colors array using a vibrant multicolored palette
  const generateColors = (count) => {
    // Vibrant multicolored palette that works well on dark backgrounds
    const themeColors = [
      [155, 255, 31],   // #9bff1f - neon green (primary accent)
      [98, 255, 198],   // #62ffc6 - cyan
      [255, 107, 107],  // #ff6b6b - coral red
      [255, 206, 84],   // #ffce54 - golden yellow
      [112, 161, 255],  // #70a1ff - bright blue
      [186, 104, 255],  // #ba68ff - purple
      [255, 159, 64],   // #ff9f40 - orange
      [72, 219, 251],   // #48dbfb - sky blue
      [255, 107, 193],  // #ff6bc1 - pink
      [46, 213, 115],   // #2ed573 - emerald
      [255, 184, 0],    // #ffb800 - amber
      [131, 56, 236]    // #8338ec - violet
    ];
    
    const backgroundColors = [];
    const borderColors = [];
    
    for (let i = 0; i < count; i++) {
      const color = themeColors[i % themeColors.length];
      // Use vibrant colors with appropriate opacity for dark theme
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

  // Verify all labels are included
  console.log('Chart labels:', labels);
  console.log('Chart counts:', counts);
  console.log('Total labels:', labels.length);

  // Create the chart
  const chart = new Chart(chartElement, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          right: 10,
          bottom: isMobile ? 100 : 120,
          left: 10
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
          display: true,
          labels: {
            boxWidth: isMobile ? 12 : 15,
            padding: isMobile ? 10 : 15,
            font: {
              family: "'Azeret Mono', 'JetBrains Mono', 'Space Mono', monospace",
              size: isMobile ? 10 : 11,
              weight: '500'
            },
            usePointStyle: true,
            pointStyle: 'circle',
            color: 'rgba(241, 255, 233, 0.85)',
            textAlign: 'left',
            // Ensure all labels are generated and displayed - don't filter any
            filter: function(legendItem, chartData) {
              // Show all legend items, even if data is 0
              return true;
            }
          },
          // Add padding to prevent cutoff
          padding: isMobile ? 20 : 30,
          // Enable full width for legend to prevent cutoff
          fullSize: false,
          // Allow legend to use full width
          rtl: false,
          // Ensure all items are shown
          onClick: function(e, legendItem) {
            // Standard click behavior
            const index = legendItem.datasetIndex !== undefined ? legendItem.datasetIndex : legendItem.index;
            const chart = this.chart;
            const meta = chart.getDatasetMeta(0);
            meta.data[index].hidden = !meta.data[index].hidden;
            chart.update();
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
  
  // Verify all legend items are rendered
  setTimeout(() => {
    const legendContainer = chartElement.parentElement;
    const legendItems = legendContainer.querySelectorAll('li, .chartjs-legend li');
    console.log('Legend items found:', legendItems.length);
    console.log('Expected labels:', labels.length);
    
    // Ensure all labels are visible
    if (legendItems.length < labels.length) {
      console.warn('Some legend items may be missing!');
      chart.update();
    }
  }, 500);

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
      chart.options.plugins.legend.position = 'bottom';
      chart.options.plugins.legend.align = 'center';
      chart.options.plugins.legend.labels.boxWidth = isMobileNow ? 12 : 15;
      chart.options.plugins.legend.labels.padding = isMobileNow ? 10 : 15;
      chart.options.plugins.legend.labels.font.size = isMobileNow ? 10 : 11;
      chart.options.plugins.legend.padding = isMobileNow ? 20 : 30;
      chart.options.layout.padding.bottom = isMobileNow ? 100 : 120;
      chart.options.cutout = isMobileNow ? '70%' : '60%';
      chart.update();
    }
  });
}); 