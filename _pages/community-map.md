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
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    position: relative;
}
.filters {
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.filter-group {
    flex: 1;
}
.filter-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #00008B;
    font-size: 0.95em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.filter-group select {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;
    font-size: 14px;
    transition: all 0.3s ease;
}
.filter-group select:focus {
    outline: none;
    border-color: #00008B;
    box-shadow: 0 0 0 3px rgba(0,0,139,0.1);
}
.filter-group select:hover {
    border-color: #00008B;
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
.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255,255,255,0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: none;
    z-index: 1000;
}
.loading.active {
    display: block;
}
.stats {
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 0.9em;
    color: #555;
}
</style>

<div class="stats" id="mapStats">
    Loading statistics...
</div>

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

<div class="map-container">
    <div class="loading" id="loadingIndicator">
        <i class="fas fa-spinner fa-spin"></i> Updating map...
    </div>
    <iframe id="mapFrame" src="/assets/maps/community_map.html" style="width: 100%; height: 100%; border: none; border-radius: 12px;"></iframe>
</div>

<div class="disclaimer">
    <p>Disclaimer: This project is neither sponsored by, or affiliated with the Doon School Old Boys' Society nor is sponsored by, or affiliated with The Doon School in any way. This project intends no harm to the society or the school, and is meant to be a passion project to put the Nizams on a map (literally).</p>
    <p>Any comments can be shared with <a href="mailto:vg224@cornell.edu">vg224@cornell.edu</a>. All data are securely stored and processed. No data will be shared with anyone other than the project's creator.</p>
</div>

<script>
async function loadMapData() {
    try {
        const response = await fetch('/assets/data/community_map_data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading map data:', error);
        return [];
    }
}

async function updateBatchOptions() {
    const data = await loadMapData();
    const batchFilter = document.getElementById('batchFilter');
    const batches = [...new Set(data.map(entry => entry.batch))].sort();
    
    batchFilter.innerHTML = '<option value="">All Batches</option>';
    batches.forEach(batch => {
        const option = document.createElement('option');
        option.value = batch;
        option.textContent = batch;
        batchFilter.appendChild(option);
    });
}

async function updateStats() {
    const data = await loadMapData();
    const statsDiv = document.getElementById('mapStats');
    const totalNizams = data.length;
    const uniqueBatches = new Set(data.map(entry => entry.batch)).size;
    const uniqueCountries = new Set(data.map(entry => {
        const address = entry.address.toLowerCase();
        // Simple country detection - could be improved
        const countries = ['usa', 'india', 'uk', 'canada', 'australia'];
        return countries.find(country => address.includes(country)) || 'other';
    })).size;

    statsDiv.innerHTML = `
        <i class="fas fa-users"></i> ${totalNizams} Nizams | 
        <i class="fas fa-graduation-cap"></i> ${uniqueBatches} Batches | 
        <i class="fas fa-globe"></i> ${uniqueCountries} Countries
    `;
}

function showLoading() {
    document.getElementById('loadingIndicator').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingIndicator').classList.remove('active');
}

// Function to reload the map iframe
function reloadMap() {
    showLoading();
    const mapFrame = document.getElementById('mapFrame');
    mapFrame.src = mapFrame.src;
    setTimeout(hideLoading, 1500); // Hide after 1.5s
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await updateBatchOptions();
    await updateStats();
    
    // Add event listeners for filters
    document.getElementById('houseFilter').addEventListener('change', reloadMap);
    document.getElementById('batchFilter').addEventListener('change', reloadMap);
});

// Reload the map every 5 minutes to check for updates
setInterval(reloadMap, 300000);
</script>

<!-- Add FontAwesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"> 