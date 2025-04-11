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
      name: "Massachusetts Institute of Technology",
      location: [42.3601, -71.0942],
      degree: "PhD Student",
      majors: "Technological Innovation, Entrepreneurship, and Strategic Management",
      yearRange: "2025-2030",
      honors: [],
      concentrations: "Behavioral Policy and Sciences",
      affiliations: "MIT Sloan School of Management",
      type: "education",
      tooltipText: "Massachusetts Institute of Technology"
    },
    {
      name: "Cornell University",
      location: [42.4534, -76.4735],
      degree: "BS, with Distinction in Research and Magna Cum Laude Honors",
      majors: "Double Majors in Applied Economics & Management, and Biometry & Statistics",
      yearRange: "2020-2023",
      gpa: "3.92",
      honors: [
        "Dyson Diversity Scholar",
        "Dean's List in all semesters"
      ],
      concentrations: "Business Analytics, Computational Statistics & Data Management, and Mathematical Statistics",
      affiliations: "Dyson School of Applied Economics and Management",
      type: "education",
      tooltipText: "Cornell University, Ithaca NY"
    },
    {
      name: "The Doon School",
      location: [30.3228, 78.0437],
      degree: "International Baccalaureate Diploma",
      majors: "",
      yearRange: "2015-2020",
      honors: [],
      concentrations: "",
      affiliations: "Dehradun, India",
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
      if (type === 'coauthor') {
        marker.bindTooltip(`${loc.name} - ${loc.institution}`, {
          permanent: false,
          direction: 'top',
          className: `${type}-tooltip`
        });
      } else if (loc.tooltipText) {
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
          <div class="education-popup-header">
            <h3>${loc.name}</h3>
            <div class="education-years"><i class="fa-regular fa-calendar"></i> ${loc.yearRange}</div>
          </div>`;
        
        // First section: degree, majors, GPA
        popupContent += `
          <div class="education-section">
            <div class="education-degree"><i class="fa-solid fa-graduation-cap"></i> ${loc.degree}</div>`;
            
        if (loc.majors) {
          popupContent += `<div class="education-majors"><i class="fa-solid fa-book"></i> ${loc.majors}</div>`;
        }
            
        if (loc.gpa) {
          popupContent += `<div class="education-gpa"><i class="fa-solid fa-star"></i> GPA: ${loc.gpa}</div>`;
        }
        
        popupContent += `</div>`;
        
        // Honors section (if any)
        if (loc.honors && loc.honors.length > 0) {
          popupContent += `
            <div class="education-section">
              <div class="section-title">Honors & Recognition</div>
              <ul class="education-honors">
                ${loc.honors.map(honor => `<li><i class="fa-solid fa-award"></i> ${honor}</li>`).join('')}
              </ul>
            </div>`;
        }
        
        // Areas of focus section (if any)
        if (loc.concentrations) {
          popupContent += `
            <div class="education-section">
              <div class="section-title">Areas of Focus</div>
              <div class="education-concentrations">${loc.concentrations}</div>
            </div>`;
        }
        
        // Affiliations section (if any)
        if (loc.affiliations) {
          popupContent += `
            <div class="education-section">
              <div class="section-title">Affiliations</div>
              <div class="education-affiliations">${loc.affiliations}</div>
            </div>`;
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
      
      // Set specific popup class based on location
      let popupClass = `${type}-popup`;
      if (loc.name === "Massachusetts Institute of Technology") {
        popupClass += " mit-popup";
      } else if (loc.name === "Cornell University") {
        popupClass += " cornell-popup";
      } else if (loc.name === "The Doon School") {
        popupClass += " doon-popup";
      }
      
      marker.bindPopup(popupContent, {
        maxWidth: 280,
        minWidth: 200,
        className: popupClass,
        autoPan: true,
        autoPanPadding: [20, 20],
        keepInView: true
      });
      
      group.addLayer(marker);
    });
  }

  // Add all markers to their respective groups
  addMarkersToGroup(educationLocations, educationGroup, 'education');
  addMarkersToGroup(coauthorLocations, coauthorsGroup, 'coauthor');
  addMarkersToGroup(talksLocations, talksGroup, 'talk');

  // Add only coauthors group to the map by default
  map.addLayer(coauthorsGroup);
  // Note: education and talks groups are not added by default

  // Create layer control for toggling groups
  const overlays = {
    "<span class='layer-label education-label'>Education</span>": educationGroup,
    "<span class='layer-label coauthor-label'>Coauthors</span>": coauthorsGroup,
    "<span class='layer-label talk-label'>Talks</span>": talksGroup
  };

  L.control.layers(null, overlays, {
    collapsed: false, // Make it open by default
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
  
  // Apply fixes for layer control display issues
  setTimeout(function() {
    // Fix any alignment issues with layer control labels
    document.querySelectorAll('.leaflet-control-layers-overlays label').forEach(function(label) {
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.whiteSpace = 'nowrap';
      label.style.width = '100%';
    });
  }, 500);
}); 