document.addEventListener('DOMContentLoaded', function() {
  // Check if the map container exists
  const mapElement = document.getElementById('research-map');
  if (!mapElement) return;

  // Initialize the map
  const map = L.map('research-map').setView([20, 0], 2);
  
  // Add a beautiful map layer (Stadia Maps - modern and clean)
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 20,
  }).addTo(map);

  // Define research locations with details
  const researchLocations = [
    {
      name: "MIT (Current)",
      location: [42.3601, -71.0942],
      description: "PhD research on innovation and proximity effects",
      type: "current"
    },
    {
      name: "GitHub Sponsors Program",
      location: [37.7749, -122.4194],
      description: "Research on effectiveness of GitHub Sponsors Program",
      type: "project",
      link: "https://www.nber.org/papers/w31668"
    },
    {
      name: "Brazil Municipal Governments",
      location: [-15.7801, -47.9292],
      description: "Research on municipal governments mitigating flooding disasters",
      type: "project",
      link: "/publication/Diario-Municipal"
    },
    {
      name: "Cornell University",
      location: [42.4534, -76.4735],
      description: "Previous academic work and teaching experience",
      type: "education"
    }
  ];

  // Custom marker icons for different types of locations
  const markerIcons = {
    current: L.divIcon({
      className: 'custom-marker current-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    }),
    project: L.divIcon({
      className: 'custom-marker project-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    }),
    education: L.divIcon({
      className: 'custom-marker education-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    })
  };

  // Add locations to the map
  researchLocations.forEach(location => {
    const marker = L.marker(location.location, {
      icon: markerIcons[location.type] || L.divIcon({className: 'custom-marker'})
    }).addTo(map);
    
    // Create popup content
    let popupContent = `<h3>${location.name}</h3><p>${location.description}</p>`;
    if (location.link) {
      popupContent += `<a href="${location.link}" class="marker-link">Learn more</a>`;
    }
    
    marker.bindPopup(popupContent);
  });

  // Add a subtle connection line between research locations
  const locationPoints = researchLocations.map(location => location.location);
  const researchPath = L.polyline(locationPoints, {
    color: '#007bff',
    weight: 2,
    opacity: 0.5,
    dashArray: '5, 10'
  }).addTo(map);

  // Add legend
  const legend = L.control({position: 'bottomright'});
  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = `
      <div class="legend-item"><span class="legend-icon current"></span> Current</div>
      <div class="legend-item"><span class="legend-icon project"></span> Research Project</div>
      <div class="legend-item"><span class="legend-icon education"></span> Education</div>
    `;
    return div;
  };
  legend.addTo(map);
}); 