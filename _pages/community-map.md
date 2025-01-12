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
}
.disclaimer h3 {
    color: #00008B;
    margin-top: 0;
    margin-bottom: 15px;
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
            <p style="font-size: 0.9em; color: #666;">If you find this project valuable and would like to support its maintenance and development, you can sponsor it through GitHub:</p>
            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <iframe src="https://github.com/sponsors/g-vansh/card" title="Sponsor g-vansh" height="225" width="600" style="border: 0;"></iframe>
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