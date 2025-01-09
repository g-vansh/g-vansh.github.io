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
</style>

<div class="filters">
    <div class="filter-group">
        <label for="houseFilter">Filter by House:</label>
        <select id="houseFilter">
            <option value="">All Houses</option>
            <option value="Red">Red House</option>
            <option value="Blue">Blue House</option>
            <option value="Green">Green House</option>
            <option value="Yellow">Yellow House</option>
        </select>
    </div>
    <div class="filter-group">
        <label for="batchFilter">Filter by Batch:</label>
        <select id="batchFilter">
            <option value="">All Batches</option>
        </select>
    </div>
</div>

<div id="map" class="map-container"></div>

<!-- Include Leaflet CSS and JS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

<script>
let map;
let markers = [];
let currentData = [];

// Initialize the map
function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    loadMapData();
}

// Load map data from the JSON file
async function loadMapData() {
    try {
        const response = await fetch('/assets/data/community_map_data.json');
        currentData = await response.json();
        updateBatchFilter();
        updateMap();
    } catch (error) {
        console.error('Error loading map data:', error);
    }
}

// Update batch filter options based on available data
function updateBatchFilter() {
    const batchFilter = document.getElementById('batchFilter');
    const batches = [...new Set(currentData.map(item => item.batch))].sort();
    
    batchFilter.innerHTML = '<option value="">All Batches</option>';
    batches.forEach(batch => {
        const option = document.createElement('option');
        option.value = batch;
        option.textContent = batch;
        batchFilter.appendChild(option);
    });
}

// Update map markers based on filters
function updateMap() {
    const houseFilter = document.getElementById('houseFilter').value;
    const batchFilter = document.getElementById('batchFilter').value;
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Filter and add new markers
    const filteredData = currentData.filter(item => {
        return (!houseFilter || item.house === houseFilter) &&
               (!batchFilter || item.batch === batchFilter);
    });
    
    filteredData.forEach(item => {
        const marker = L.marker([item.lat, item.lng]);
        
        // Create popup content
        let popupContent = `
            <strong>${item.name}</strong><br>
            ${item.photo ? `<img src="${item.photo}" style="max-width:100px;"><br>` : ''}
            Number: ${item.number}<br>
            House: ${item.house}<br>
            Batch: ${item.batch}<br>
            Address: ${item.address}
        `;
        
        marker.bindPopup(popupContent);
        marker.addTo(map);
        markers.push(marker);
    });
    
    // Adjust map bounds if there are markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds());
    }
}

// Add event listeners
document.getElementById('houseFilter').addEventListener('change', updateMap);
document.getElementById('batchFilter').addEventListener('change', updateMap);

// Initialize map when page loads
window.addEventListener('load', initMap);
</script> 