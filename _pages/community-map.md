---
layout: single
title: "Nizam Map"
permalink: /community-map/
author_profile: true
---

<style>
.page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
.map-wrapper {
    position: relative;
    width: 100%;
    height: calc(100vh - 200px);
    min-height: 600px;
    margin: 20px 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.map-container {
    width: 100%;
    height: 100%;
    border: none;
}

/* Mobile-specific map styles */
@media screen and (max-width: 768px) {
    .page-container {
        padding: 0 10px;
    }
    
    .map-wrapper {
        height: calc(100vh - 120px);
        min-height: 450px;
        margin: 10px 0;
        border-radius: 8px;
    }
    
    /* Improve marker cluster visibility on mobile */
    .marker-cluster {
        background: rgba(0, 0, 139, 0.95) !important;
        border: 2px solid white !important;
        border-radius: 50% !important;
        width: 42px !important;
        height: 42px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    
    .marker-cluster div {
        background: transparent !important;
        color: white !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
    }
    
    /* Better popup sizing */
    .leaflet-popup-content-wrapper {
        max-width: 280px !important;
        border-radius: 10px !important;
    }
    
    .leaflet-popup-content {
        margin: 12px !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
    }
    
    .leaflet-popup-content h4 {
        font-size: 16px !important;
        margin-bottom: 8px !important;
    }
    
    .leaflet-popup-content p {
        margin: 4px 0 !important;
        font-size: 13px !important;
    }
    
    /* Hide mouse position control on mobile */
    .leaflet-control-mouseposition {
        display: none !important;
    }
    
    /* Improve zoom control visibility */
    .leaflet-control-zoom {
        transform: scale(1.1);
    }
    
    /* Better search/geocoder control */
    .leaflet-control-geocoder {
        max-width: calc(100vw - 120px) !important;
    }
}
.map-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background-color: #00008B;
    color: white !important;
    text-decoration: none !important;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.9em;
    transition: all 0.3s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
.map-button:hover {
    background-color: #000066;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.map-button i {
    font-size: 1em;
}
.disclaimer {
    margin: 30px 0;
    padding: 25px;
    background-color: #f8f9fa;
    border-left: 4px solid #00008B;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.disclaimer p {
    margin: 10px 0;
    color: #555;
    line-height: 1.6;
    font-size: 0.95em;
}
.disclaimer a {
    color: #00008B;
    text-decoration: none;
    border-bottom: 1px dotted #00008B;
    transition: all 0.2s ease;
}
.disclaimer a:hover {
    color: #000066;
    border-bottom-style: solid;
}
.button-container {
    text-align: center;
    margin: 30px 0;
}
.privacy-notice {
    margin: 30px 0;
    padding: 25px;
    background-color: #f8f9fa;
    border-left: 4px solid #00008B;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.privacy-notice h3 {
    color: #00008B;
    margin-top: 0;
    margin-bottom: 15px;
}
.privacy-notice ul, .disclaimer ul {
    margin: 10px 0;
    padding-left: 20px;
}
.privacy-notice li, .disclaimer li {
    color: #555;
    line-height: 1.6;
    margin: 5px 0;
    font-size: 0.95em;
}
.disclaimer h3 {
    color: #00008B;
    margin-top: 0;
    margin-bottom: 15px;
}
.sponsor-card-container {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    padding: 10px;
    width: 100%;
    overflow: hidden;
}
.sponsor-card-container iframe {
    width: 600px;
    height: 100px;
    border: 0;
    border-radius: 8px;
    max-width: 100%;
}

/* Mobile-specific styles */
@media screen and (max-width: 768px) {
    .disclaimer,
    .privacy-notice {
        margin: 20px 0;
        padding: 15px;
        font-size: 0.95em;
    }
    
    .disclaimer p,
    .privacy-notice p,
    .disclaimer li,
    .privacy-notice li {
        font-size: 0.9em;
        line-height: 1.6;
    }
    
    .disclaimer h3,
    .privacy-notice h3 {
        font-size: 1.15em;
    }
    
    .button-container {
        margin: 20px 0;
    }
    
    .map-button {
        width: 100%;
        max-width: 300px;
        justify-content: center;
        font-size: 0.95em;
        padding: 10px 18px;
    }
    
    .sponsor-card-container iframe {
        height: 225px;
    }
}

/* Extra small mobile devices */
@media screen and (max-width: 480px) {
    .map-wrapper {
        height: calc(100vh - 100px);
        min-height: 380px;
    }
    
    .leaflet-popup-content-wrapper {
        max-width: calc(100vw - 60px) !important;
    }
    
    .marker-cluster {
        width: 38px !important;
        height: 38px !important;
    }
    
    .marker-cluster div {
        font-size: 14px !important;
    }
    
    /* Smaller buttons on very small screens */
    .leaflet-control-zoom a {
        width: 32px !important;
        height: 32px !important;
        line-height: 32px !important;
        font-size: 18px !important;
    }
}
</style>

<div class="page-container">
    <div class="map-wrapper">
        <iframe id="mapFrame" src="{{ site.baseurl }}/assets/maps/community_map.html" class="map-container" frameborder="0"></iframe>
    </div>

    <div class="button-container">
        <a href="/community-map-form/" class="map-button">
            <i class="fas fa-map-marker-alt"></i> Put yourself on the map!
        </a>
    </div>

    <div class="privacy-notice">
        <h3>Privacy Protection</h3>
        <p>To protect your privacy:</p>
        <ul>
            <li>All marker locations are randomly placed within a 1.5km radius of the provided address</li>
            <li>Exact addresses are never displayed on the map</li>
            <li>Contact information is only shown if explicitly provided</li>
        </ul>
    </div>

    <div class="disclaimer">
        <h3>Disclaimer</h3>
        <p>This project is neither sponsored by, or affiliated with the Doon School Old Boys' Society nor is sponsored by, or affiliated with The Doon School in any way. This project intends no harm to the society or the school, and is meant to be a passion project to put the Nizams on a map (literally).</p>
        <p>This is a completely non-profit project developed and maintained out of personal interest. While I welcome <a href="https://github.com/sponsors/g-vansh" target="_blank">GitHub sponsorships</a> to help cover hosting costs and support future improvements, there is absolutely no profit motive behind this initiative.</p>
        <p>By using this map, you acknowledge and agree that:</p>
        <ul>
            <li>The information provided is voluntarily shared by users</li>
            <li>While I implement privacy measures (location randomization, address hiding), I cannot guarantee absolute privacy or security of information</li>
            <li>I am not liable for any misuse, data breaches, or unintended disclosure of information</li>
            <li>You are responsible for the accuracy and appropriateness of the information you provide</li>
            <li>I recommend sharing only information you're comfortable being publicly accessible</li>
        </ul>
        <p>Any comments can be shared with <a href="mailto:vg224@cornell.edu">vg224@cornell.edu</a>. All data are securely stored and processed. No data will be shared with anyone other than myself.</p>
        <div class="sponsor-section" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 0.95em; color: #555; line-height: 1.6;">If you find this project valuable and would like to support its maintenance and development, you can sponsor it through GitHub:</p>
            <div class="sponsor-card-container">
                <iframe src="https://github.com/sponsors/g-vansh/card" title="Sponsor g-vansh"></iframe>
            </div>
        </div>
    </div>
</div>

<script>
// Function to load the map with a timestamp parameter
function loadMap() {
    const mapFrame = document.getElementById('mapFrame');
    const timestamp = new Date().getTime();
    mapFrame.src = "{{ site.baseurl }}/assets/maps/community_map.html?t=" + timestamp;
}

// Load map initially with timestamp
const initialTimestamp = new Date().getTime();
document.getElementById('mapFrame').src = "{{ site.baseurl }}/assets/maps/community_map.html?t=" + initialTimestamp;

// Reload the map every 5 minutes
setInterval(loadMap, 300000);

// Add event listener for page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Reload map when page becomes visible again
        loadMap();
    }
});
</script> 