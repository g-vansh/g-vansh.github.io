---
layout: single
title: "Community Map"
permalink: /community-map/
author_profile: true
---

<style>
.map-container {
    height: 600px;
    width: 100%;
    margin: 20px 0;
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
}
.filter-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.contact-info {
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px solid #eee;
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

<iframe id="mapFrame" src="/assets/maps/community_map.html" style="width: 100%; height: 600px; border: none;"></iframe>

<script>
// Function to reload the map iframe
function reloadMap() {
    const mapFrame = document.getElementById('mapFrame');
    mapFrame.src = mapFrame.src;
}

// Reload the map every 5 minutes to check for updates
setInterval(reloadMap, 300000);
</script> 