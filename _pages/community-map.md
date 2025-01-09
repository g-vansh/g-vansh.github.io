---
layout: single
title: "Nizam Map"
permalink: /community-map/
author_profile: true
---

<style>
.map-container {
    height: 700px;
    width: 100%;
    margin: 20px 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.filters {
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
}
.filter-group {
    flex: 1;
}
.filter-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
}
.filter-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-color: white;
    font-size: 14px;
}
.filter-group select:focus {
    outline: none;
    border-color: #00008B;
    box-shadow: 0 0 0 2px rgba(0,0,139,0.1);
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

<div class="filters">
    <div class="filter-group">
        <label for="houseFilter">Filter by House:</label>
        <select id="houseFilter">
            <option value="">All Houses</option>
            <option value="Hyderabad">Hyderabad</option>
        </select>
    </div>
    <div class="filter-group">
        <label for="batchFilter">Filter by Batch:</label>
        <select id="batchFilter">
            <option value="">All Batches</option>
        </select>
    </div>
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