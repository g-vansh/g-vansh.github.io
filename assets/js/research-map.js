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
      yearRange: "2021-Present",
      department: "Sloan School of Management",
      type: "education",
      tooltipText: "Massachusetts Institute of Technology"
    },
    {
      name: "Cornell University",
      location: [42.4534, -76.4735],
      description: "Graduate studies",
      yearRange: "2019-2021",
      department: "Dyson School of Applied Economics and Management",
      type: "education",
      tooltipText: "Cornell University, Ithaca NY"
    },
    {
      name: "The Doon School",
      location: [30.3228, 78.0437],
      description: "High school in Dehradun, India",
      yearRange: "2012-2017",
      type: "education",
      tooltipText: "The Doon School, Dehradun"
    }
  ];
  
  const coauthorLocations = [
    {
      name: "Daniela Scur",
      location: [42.4534, -76.4735],
      institution: "Cornell University",
      designation: "Assistant Professor",
      department: "Dyson School of Applied Economics and Management",
      type: "coauthor",
      tooltipText: "Collaborator on Brazilian municipalities research",
      projects: [
        {
          title: "Local Government State Capacity: Evidence from Brazil",
          url: "/publication/Diario-Municipal-Dataset",
          status: "In Progress"
        },
        {
          title: "Municipal Responses to Natural Disasters",
          url: "/publication/Diario-Municipal-Responses",
          status: "In Progress"
        }
      ],
      website: "https://danielascur.com/"
    },
    {
      name: "Jorge Guzman",
      location: [40.8075, -73.9626],
      institution: "Columbia University",
      designation: "Gantcher Associate Professor of Business",
      department: "Columbia Business School",
      type: "coauthor",
      tooltipText: "Collaborator on GitHub Sponsors research",
      projects: [
        {
          title: "Incentivizing Innovation in Open Source: Evidence from the GitHub Sponsors Program",
          url: "/publication/Sponsoring-Innovation",
          status: "NBER Working Paper"
        }
      ],
      website: "https://www.jorgeguzman.co/"
    },
    {
      name: "Michael Best",
      location: [40.8075, -73.9626],
      institution: "Columbia University",
      designation: "Assistant Professor",
      department: "Department of Economics",
      type: "coauthor",
      tooltipText: "Collaborator on Brazilian municipalities research",
      projects: [
        {
          title: "Local Government State Capacity: Evidence from Brazil",
          url: "/publication/Diario-Municipal-Dataset",
          status: "In Progress"
        },
        {
          title: "Municipal Responses to Natural Disasters",
          url: "/publication/Diario-Municipal-Responses",
          status: "In Progress"
        }
      ],
      website: "https://www.columbia.edu/~mcb2270/"
    },
    {
      name: "Maria Roche",
      location: [42.3770, -71.1167],
      institution: "Harvard University",
      designation: "Assistant Professor",
      department: "Harvard Business School",
      type: "coauthor",
      tooltipText: "Collaborator on GitHub Sponsors research",
      projects: [
        {
          title: "Incentivizing Innovation in Open Source: Evidence from the GitHub Sponsors Program",
          url: "/publication/Sponsoring-Innovation",
          status: "NBER Working Paper"
        }
      ],
      website: "https://www.hbs.edu/faculty/Pages/profile.aspx?facId=1284955"
    },
    {
      name: "Annamaria Conti",
      location: [40.4165, -3.7026],
      institution: "IE University",
      designation: "Full Professor",
      department: "IE Business School",
      type: "coauthor",
      tooltipText: "Collaborator on GitHub Sponsors research",
      projects: [
        {
          title: "Incentivizing Innovation in Open Source: Evidence from the GitHub Sponsors Program",
          url: "/publication/Sponsoring-Innovation",
          status: "NBER Working Paper"
        }
      ],
      website: "https://sites.google.com/view/annamariaconti/home-page"
    },
    {
      name: "Renata Lemos",
      location: [38.9072, -77.0369],
      institution: "World Bank Washington DC",
      designation: "Senior Economist",
      department: "Education Global Practice",
      type: "coauthor",
      tooltipText: "Collaborator on Brazilian municipalities research",
      projects: [
        {
          title: "Local Government State Capacity: Evidence from Brazil",
          url: "/publication/Diario-Municipal-Dataset",
          status: "In Progress"
        },
        {
          title: "Municipal Responses to Natural Disasters",
          url: "/publication/Diario-Municipal-Responses",
          status: "In Progress"
        }
      ],
      website: "https://renatalemos.com/"
    }
  ];
  
  const talksLocations = [
    {
      name: "Strategy & Innovation",
      location: [40.8075, -73.9626],
      institution: "Columbia University",
      type: "talk",
      tooltipText: "Research presentation on GitHub Sponsors & Strategic Treatment Effects",
      date: "July 2022",
      papers: [
        {
          title: "Incentivizing Innovation in Open Source",
          url: "/publication/Sponsoring-Innovation"
        },
        {
          title: "Treatment Effects in Managerial Strategies",
          url: "/publication/STE"
        }
      ]
    },
    {
      name: "Development, Firms, & Labor Research Working Group",
      location: [42.4534, -76.4735],
      institution: "Cornell University",
      type: "talk",
      tooltipText: "Research presentation on education strategies",
      date: "March 2023",
      papers: [
        {
          title: "Approaches and Resources for Improved Student Outcomes: Evidence from Brazil",
          url: "/publication/Dropout-Retention"
        }
      ]
    },
    {
      name: "Theoretical and Applied Development",
      location: [42.4534, -76.4735],
      institution: "Cornell University",
      type: "talk",
      tooltipText: "Research presentation on education strategies",
      date: "April 2023",
      papers: [
        {
          title: "Approaches and Resources for Improved Student Outcomes: Evidence from Brazil",
          url: "/publication/Dropout-Retention"
        }
      ]
    }
  ];

  // Function to add markers to their respective groups
  function addMarkersToGroup(locations, group, type) {
    locations.forEach(loc => {
      const marker = L.marker(loc.location, {
        icon: markerIcons[type]
      });
      
      // Create tooltip based on location type
      if (loc.tooltipText) {
        marker.bindTooltip(loc.tooltipText, {
          permanent: false,
          direction: 'top',
          className: `${type}-tooltip`
        });
      }
      
      // Create popup content based on location type
      let popupContent = `<div class="custom-popup">`;
      
      if (type === 'education') {
        popupContent += `
          <h3>${loc.name}</h3>
          <p>${loc.description}</p>
          <p><i class="fa-regular fa-calendar"></i> ${loc.yearRange}</p>`;
        
        if (loc.department) {
          popupContent += `<p><i class="fa-solid fa-building-columns"></i> ${loc.department}</p>`;
        }
      } else if (type === 'coauthor') {
        popupContent += `
          <h3>${loc.name}</h3>
          <p><i class="fa-solid fa-user-tie"></i> ${loc.designation}</p>
          <p><i class="fa-solid fa-building"></i> ${loc.department}, ${loc.institution}</p>`;
        
        if (loc.website) {
          popupContent += `
            <a href="${loc.website}" class="popup-link" target="_blank">
              <i class="fa-solid fa-globe"></i> Personal Website
            </a>`;
        }
        
        if (loc.projects && loc.projects.length > 0) {
          popupContent += `<div class="popup-meta">Joint projects:</div>`;
          popupContent += `<div class="popup-links">`;
          loc.projects.forEach(project => {
            popupContent += `
              <a href="${project.url}" class="popup-link" target="_blank">
                <i class="fa-solid fa-file-lines"></i> ${project.title}
              </a>`;
          });
          popupContent += `</div>`;
        }
      } else if (type === 'talk') {
        popupContent += `
          <h3>${loc.name}</h3>
          <p><i class="fa-solid fa-building"></i> ${loc.institution}</p>
          <p><i class="fa-regular fa-calendar"></i> ${loc.date}</p>`;
        
        if (loc.papers && loc.papers.length > 0) {
          popupContent += `<div class="popup-meta">Presented papers:</div>`;
          popupContent += `<div class="popup-links">`;
          loc.papers.forEach(paper => {
            popupContent += `
              <a href="${paper.url}" class="popup-link" target="_blank">
                <i class="fa-solid fa-file-lines"></i> ${paper.title}
              </a>`;
          });
          popupContent += `</div>`;
        }
      }
      
      popupContent += `</div>`;
      
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        minWidth: 200,
        className: `${type}-popup`
      });
      
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
    "<span class='layer-label education-label'>Education</span>": educationGroup,
    "<span class='layer-label coauthor-label'>Coauthors</span>": coauthorsGroup,
    "<span class='layer-label talk-label'>Talks</span>": talksGroup
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