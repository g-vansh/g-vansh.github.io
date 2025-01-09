---
layout: single
title: "Nizam Map"
permalink: /community-map/
author_profile: true
---

<style>
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.header-title {
    margin: 0;
    font-size: 2.5em;
}
.map-container {
    height: 700px;
    width: 100%;
    margin: 20px 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.map-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background-color: #00008B;
    color: white !important;
    text-decoration: none !important;
    border-radius: 6px;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.map-button:hover {
    background-color: #000066;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
.disclaimer {
    margin: 30px 0;
    padding: 20px;
    background-color: #f8f9fa;
    border-left: 4px solid #00008B;
    border-radius: 4px;
}
.disclaimer p {
    margin: 10px 0;
    color: #555;
    line-height: 1.5;
}
</style>

<div class="header-container">
    <h1 class="header-title">Nizam Map</h1>
    <a href="/community-map-form/" class="map-button">
        <i class="fas fa-map-marker-alt"></i> Put yourself on the map!
    </a>
</div>

<iframe id="mapFrame" src="/assets/maps/community_map.html" class="map-container"></iframe>

<div class="disclaimer">
    <p>Disclaimer: This project is neither sponsored by, or affiliated with the Doon School Old Boys' Society nor is sponsored by, or affiliated with The Doon School in any way. This project intends no harm to the society or the school, and is meant to be a passion project to put the Nizams on a map (literally).</p>
    <p>Any comments can be shared with <a href="mailto:vg224@cornell.edu">vg224@cornell.edu</a>. All data are securely stored and processed. No data will be shared with anyone other than the project's creator.</p>
</div>

<script>
// Function to reload the map iframe
function reloadMap() {
    const mapFrame = document.getElementById('mapFrame');
    mapFrame.src = mapFrame.src;
}

// Reload the map every 5 minutes to check for updates
setInterval(reloadMap, 300000);
</script> 