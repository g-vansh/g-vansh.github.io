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
.map-container {
    height: 75vh;
    width: 100%;
    margin: 20px 0;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transition: box-shadow 0.3s ease;
}
.map-container:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.12);
}
.map-button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    background-color: #00008B;
    color: white !important;
    text-decoration: none !important;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1.1em;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 10px;
}
.map-button:hover {
    background-color: #000066;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.map-button i {
    font-size: 1.2em;
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
</style>

<div class="page-container">
    <a href="/community-map-form/" class="map-button">
        <i class="fas fa-map-marker-alt"></i> Put yourself on the map!
    </a>

    <iframe id="mapFrame" src="/assets/maps/community_map.html" class="map-container"></iframe>

    <div class="disclaimer">
        <p>Disclaimer: This project is neither sponsored by, or affiliated with the Doon School Old Boys' Society nor is sponsored by, or affiliated with The Doon School in any way. This project intends no harm to the society or the school, and is meant to be a passion project to put the Nizams on a map (literally).</p>
        <p>Any comments can be shared with <a href="mailto:vg224@cornell.edu">vg224@cornell.edu</a>. All data are securely stored and processed. No data will be shared with anyone other than the project's creator.</p>
    </div>
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