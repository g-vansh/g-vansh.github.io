document.addEventListener('DOMContentLoaded', function() {
  // Check if the map container exists
  const mapElement = document.getElementById('research-map');
  if (!mapElement) return;

  // Initialize the map with a more zoomed-out view
  const map = L.map('research-map', {
    minZoom: 2,
    worldCopyJump: true,
    zoomControl: false
  }).setView([30, 0], 2);
  
  // Add zoom control to top-right
  L.control.zoom({
    position: 'topright'
  }).addTo(map);
  
  // Add a beautiful map layer - CartoDB Positron style
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Create marker groups
  const educationGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        html: `<div class="custom-cluster education-cluster">${cluster.getChildCount()}</div>`,
        className: 'marker-cluster-custom',
        iconSize: new L.Point(40, 40)
      });
    }
  });
  
  const coauthorsGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        html: `<div class="custom-cluster coauthor-cluster">${cluster.getChildCount()}</div>`,
        className: 'marker-cluster-custom',
        iconSize: new L.Point(40, 40)
      });
    }
  });
  
  const talksGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        html: `<div class="custom-cluster talk-cluster">${cluster.getChildCount()}</div>`,
        className: 'marker-cluster-custom',
        iconSize: new L.Point(40, 40)
      });
    }
  });

  // Custom marker icons for different types of locations using Font Awesome
  const markerIcons = {
    education: L.divIcon({
      html: `<div class="custom-icon education-icon"><i class="fa-solid fa-graduation-cap"></i></div>`,
      className: 'custom-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35]
    }),
    coauthor: L.divIcon({
      html: `<div class="custom-icon coauthor-icon"><i class="fa-solid fa-user-tie"></i></div>`,
      className: 'custom-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35]
    }),
    talk: L.divIcon({
      html: `<div class="custom-icon talk-icon"><i class="fa-solid fa-person-chalkboard"></i></div>`,
      className: 'custom-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35]
    })
  };

  // Define research locations with details
  const educationLocations = [
    {
      name: "MIT",
      location: [42.3601, -71.0942],
      description: "PhD research on innovation and proximity effects",
      type: "education"
    },
    {
      name: "Cornell University",
      location: [42.4534, -76.4735],
      description: "Graduate studies",
      type: "education"
    },
    {
      name: "The Doon School",
      location: [30.3228, 78.0437],
      description: "High school in Dehradun, India",
      type: "education"
    }
  ];
  
  const coauthorLocations = [
    {
      name: "Daniela Scur",
      location: [42.4534, -76.4735],
      institution: "Cornell University",
      type: "coauthor"
    },
    {
      name: "Jorge Guzman",
      location: [40.8075, -73.9626],
      institution: "Columbia University",
      type: "coauthor"
    },
    {
      name: "Michael Best",
      location: [40.8075, -73.9626],
      institution: "Columbia University",
      type: "coauthor"
    },
    {
      name: "Maria Roche",
      location: [42.3770, -71.1167],
      institution: "Harvard University",
      type: "coauthor"
    },
    {
      name: "Annamaria Conti",
      location: [40.4165, -3.7026],
      institution: "IE University",
      type: "coauthor"
    },
    {
      name: "Renata Lemos",
      location: [38.9072, -77.0369],
      institution: "World Bank Washington DC",
      type: "coauthor"
    }
  ];
  
  const talksLocations = [
    {
      name: "Strategy & Innovation",
      location: [40.8075, -73.9626],
      institution: "Columbia University",
      type: "talk"
    },
    {
      name: "Development, Firms, & Labor Research Working Group",
      location: [42.4534, -76.4735],
      institution: "Cornell University",
      type: "talk"
    },
    {
      name: "Theoretical and Applied Development",
      location: [42.4534, -76.4735],
      institution: "Cornell University",
      type: "talk"
    }
  ];

  // Function to add markers to their respective groups
  function addMarkersToGroup(locations, group, type) {
    locations.forEach(loc => {
      const marker = L.marker(loc.location, {
        icon: markerIcons[type]
      });
      
      // Create popup content based on location type
      let popupContent = `<div class="custom-popup"><h3>${loc.name}</h3>`;
      
      if (type === 'education') {
        popupContent += `<p>${loc.description}</p>`;
      } else if (type === 'coauthor') {
        popupContent += `<p>Affiliation: ${loc.institution}</p>`;
      } else if (type === 'talk') {
        popupContent += `<p>Venue: ${loc.institution}</p>`;
      }
      
      popupContent += `</div>`;
      
      marker.bindPopup(popupContent);
      group.addLayer(marker);
    });
  }

  // Add all markers to their respective groups
  addMarkersToGroup(educationLocations, educationGroup, 'education');
  addMarkersToGroup(coauthorLocations, coauthorsGroup, 'coauthor');
  addMarkersToGroup(talksLocations, talksGroup, 'talk');

  // Add all groups to the map
  map.addLayer(educationGroup);
  map.addLayer(coauthorsGroup);
  map.addLayer(talksGroup);

  // Create layer control for toggling groups
  const overlays = {
    "Education": educationGroup,
    "Coauthors": coauthorsGroup,
    "Talks": talksGroup
  };

  L.control.layers(null, overlays, {
    collapsed: true,
    position: 'topright',
    className: 'wider-layer-control'
  }).addTo(map);

  // Add a beautiful legend
  const legend = L.control({position: 'bottomleft'});
  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = `
      <div class="legend-container">
        <h4>Research Network</h4>
        <div class="legend-item"><span class="legend-icon education"><i class="fa-solid fa-graduation-cap"></i></span> Education</div>
        <div class="legend-item"><span class="legend-icon coauthor"><i class="fa-solid fa-user-tie"></i></span> Coauthors</div>
        <div class="legend-item"><span class="legend-icon talk"><i class="fa-solid fa-person-chalkboard"></i></span> Talks</div>
      </div>
    `;
    return div;
  };
  legend.addTo(map);

  // Add some custom styling to the map container
  mapElement.style.borderRadius = '8px';
  mapElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
}); 