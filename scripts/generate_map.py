import json
import os
import folium
from folium import plugins
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from datetime import datetime

def geocode_address(address):
    """Geocode an address using OpenStreetMap's Nominatim service."""
    geolocator = Nominatim(user_agent="nizam_map")
    try:
        location = geolocator.geocode(address)
        if location:
            return location.latitude, location.longitude
        return None
    except GeocoderTimedOut:
        return None

def load_existing_data():
    """Load existing map data from JSON file."""
    data_file = "assets/data/community_map_data.json"
    if os.path.exists(data_file):
        with open(data_file, 'r') as f:
            return json.load(f)
    return []

def save_data(data):
    """Save map data to JSON file."""
    os.makedirs("assets/data", exist_ok=True)
    with open("assets/data/community_map_data.json", 'w') as f:
        json.dump(data, f, indent=2)

def add_new_entry(entry_data):
    """Add a new entry to the map data."""
    data = load_existing_data()
    coordinates = geocode_address(entry_data['address'])
    if coordinates:
        lat, lng = coordinates
        entry_data['lat'] = lat
        entry_data['lng'] = lng
        data.append(entry_data)
        save_data(data)
        return True
    return False

def generate_map():
    """Generate the map with all entries."""
    data = load_existing_data()
    
    if not data:
        print("No data found to generate map")
        return
    
    print(f"Generating map with {len(data)} entries...")
    
    # Calculate center and bounds
    lats = [entry['lat'] for entry in data]
    lngs = [entry['lng'] for entry in data]
    center_lat = sum(lats) / len(lats)
    center_lng = sum(lngs) / len(lngs)
    
    # Create map with cartodbpositron tiles
    m = folium.Map(
        location=[center_lat, center_lng],
        zoom_start=3,
        tiles='cartodbpositron',
        width='100%',
        height='100%'
    )
    
    # Add map controls
    plugins.Fullscreen(
        position='topright',
        title='Fullscreen',
        title_cancel='Exit fullscreen',
        force_separate_button=True
    ).add_to(m)
    
    plugins.MousePosition().add_to(m)
    
    plugins.Geocoder(
        position='topright',
        add_marker=False,
        collapsed=True
    ).add_to(m)
    
    # Get unique batch years and sort them
    batch_years = sorted(list(set(entry['batch'] for entry in data)))
    
    # Create a marker cluster group with custom options
    marker_cluster = plugins.MarkerCluster(
        name='Nizams',
        overlay=True,
        control=True,
        options={
            'maxClusterRadius': 35,
            'spiderfyOnMaxZoom': True,
            'showCoverageOnHover': True,
            'zoomToBoundsOnClick': True,
            'disableClusteringAtZoom': 15
        },
        icon_create_function='''
        function(cluster) {
            var count = cluster.getChildCount();
            var size = count < 10 ? 30 : (count < 50 ? 35 : 40);
            return L.divIcon({
                html: '<div style="background-color: #00008B; color: white; border-radius: 50%; width: ' + size + 'px; height: ' + size + 'px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">' + count + '</div>',
                className: 'marker-cluster',
                iconSize: L.point(size, size)
            });
        }
        '''
    )
    
    # Custom icon HTML with shadow
    icon_html = '''
    <div style="background-color: #00008B; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
        <i class="fa-solid fa-user"></i>
    </div>
    '''
    
    # Add markers for each entry with data attributes for filtering
    markers_data = []
    for entry in data:
        # Create popup content
        popup_html = f"""
        <div style="font-family: Arial, sans-serif; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0; color: #00008B; border-bottom: 2px solid #00008B; padding-bottom: 5px;">
                {entry['name']}
            </h4>
            <p style="margin: 5px 0;"><strong>Number:</strong> {entry['number']}</p>
            <p style="margin: 5px 0;"><strong>House:</strong> {entry['house']}</p>
            <p style="margin: 5px 0;"><strong>Batch:</strong> {entry['batch']}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> {entry['address']}</p>
        """
        
        # Add contact information if provided
        contact_info = []
        if entry.get('email'):
            contact_info.append(f'<p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:{entry["email"]}" style="color: #00008B;">{entry["email"]}</a></p>')
        if entry.get('phone'):
            contact_info.append(f'<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:{entry["phone"]}" style="color: #00008B;">{entry["phone"]}</a></p>')
        
        if contact_info:
            popup_html += '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">'
            popup_html += ''.join(contact_info)
            popup_html += '</div>'
        
        popup_html += '</div>'
        
        # Create custom icon
        icon = folium.DivIcon(
            html=icon_html,
            icon_size=(24, 24),
            icon_anchor=(12, 12)
        )
        
        # Create marker with tooltip and store its data
        marker = folium.Marker(
            location=[entry['lat'], entry['lng']],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=f"{entry['name']} - {entry['batch']} - {entry['house']}",
            icon=icon
        )
        
        # Add data attributes for filtering
        marker.add_to(marker_cluster)
        markers_data.append({
            'batch': entry['batch'],
            'element': f'marker_{len(markers_data)}'
        })
    
    # Add the marker cluster to the map
    marker_cluster.add_to(m)
    
    # Add custom CSS and JS for filtering
    custom_css = '''
    <style>
        .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
        }
        .leaflet-popup-content {
            margin: 15px;
        }
        .leaflet-popup-tip {
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
        }
        .leaflet-tooltip {
            background: #00008B;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .leaflet-tooltip-left:before {
            border-left-color: #00008B;
        }
        .leaflet-tooltip-right:before {
            border-right-color: #00008B;
        }
        .filter-control {
            position: absolute;
            top: 80px;
            right: 10px;
            z-index: 1000;
            background: white;
            padding: 12px 15px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.1);
            max-width: 200px;
            backdrop-filter: blur(5px);
            background-color: rgba(255, 255, 255, 0.95);
        }
        .filter-control select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            width: 100%;
            background-color: #f8f9fa;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .filter-control select:hover {
            border-color: #00008B;
            background-color: white;
        }
        .filter-control select:focus {
            outline: none;
            border-color: #00008B;
            box-shadow: 0 0 0 2px rgba(0,0,139,0.1);
            background-color: white;
        }
        .filter-control label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    </style>
    '''
    
    # Add filter control HTML
    filter_html = f'''
    <div class="filter-control leaflet-control">
        <label for="batchFilter">Filter by Batch:</label>
        <select id="batchFilter" onchange="filterMarkers(this.value)">
            <option value="">All Batches</option>
            {"".join(f'<option value="{year}">{year}</option>' for year in batch_years)}
        </select>
    </div>
    '''
    
    # Add filter JavaScript
    filter_js = '''
    <script>
    function filterMarkers(batch) {
        var markers = document.querySelectorAll('.leaflet-marker-icon');
        if (batch === '') {
            markers.forEach(function(marker) {
                marker.style.display = '';
            });
            return;
        }
        
        var markerData = ''' + json.dumps(markers_data) + ''';
        markerData.forEach(function(data, index) {
            var marker = markers[index];
            if (marker) {
                if (data.batch === batch) {
                    marker.style.display = '';
                } else {
                    marker.style.display = 'none';
                }
            }
        });
    }
    </script>
    '''
    
    # Add timestamp to force map update
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    timestamp_html = f'''
    <div style="position: absolute; bottom: 5px; right: 5px; background: rgba(255,255,255,0.8); padding: 2px 5px; border-radius: 3px; font-size: 10px; color: #666;">
        Last updated: {timestamp}
    </div>
    '''
    
    # Add all elements to the map
    m.get_root().header.add_child(folium.Element('''
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    ''' + custom_css))
    m.get_root().html.add_child(folium.Element(filter_html + filter_js + timestamp_html))
    
    # Ensure the maps directory exists
    os.makedirs("assets/maps", exist_ok=True)
    
    # Force remove the old map file if it exists
    map_file = "assets/maps/community_map.html"
    if os.path.exists(map_file):
        os.remove(map_file)
    
    # Save the new map
    m.save(map_file)
    print(f"Map generated successfully with timestamp: {timestamp}")

if __name__ == "__main__":
    if os.environ.get('GITHUB_EVENT_PATH'):
        with open(os.environ['GITHUB_EVENT_PATH'], 'r') as f:
            event = json.load(f)
            if 'client_payload' in event:
                entry_data = event['client_payload']
                if add_new_entry(entry_data):
                    generate_map()
            else:
                # If no client_payload, just regenerate the map
                generate_map()
    else:
        generate_map()