import json
import os
import folium
from folium import plugins
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

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
    # Load existing data
    data = load_existing_data()
    
    # Geocode the address
    coordinates = geocode_address(entry_data['address'])
    if coordinates:
        lat, lng = coordinates
        entry_data['lat'] = lat
        entry_data['lng'] = lng
        
        # Add to data list
        data.append(entry_data)
        
        # Save updated data
        save_data(data)
        return True
    return False

def generate_map():
    """Generate the map with all entries."""
    data = load_existing_data()
    
    if not data:
        return
    
    # Create a map centered on the mean of all coordinates
    lats = [entry['lat'] for entry in data]
    lngs = [entry['lng'] for entry in data]
    center_lat = sum(lats) / len(lats)
    center_lng = sum(lngs) / len(lngs)
    
    # Create map with cartodbpositron tiles
    m = folium.Map(
        location=[center_lat, center_lng],
        zoom_start=4,
        tiles='cartodbpositron',
        width='100%',
        height='100%'
    )
    
    # Add fullscreen option
    plugins.Fullscreen().add_to(m)
    
    # Create a marker cluster group
    marker_cluster = plugins.MarkerCluster(
        name='Nizams',
        overlay=True,
        control=True,
        icon_create_function='''
        function(cluster) {
            return L.divIcon({
                html: '<div style="background-color: #00008B; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">' + cluster.getChildCount() + '</div>',
                className: 'marker-cluster',
                iconSize: L.point(30, 30)
            });
        }
        '''
    )
    
    # Custom icon HTML
    icon_html = '''
    <div style="background-color: #00008B; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <i class="fa-solid fa-user"></i>
    </div>
    '''
    
    # Add markers for each entry
    for entry in data:
        # Create popup content with contact information
        popup_html = f"""
        <div style="font-family: Arial, sans-serif; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0; color: #00008B;">{entry['name']}</h4>
            <p style="margin: 5px 0;"><strong>Number:</strong> {entry['number']}</p>
            <p style="margin: 5px 0;"><strong>House:</strong> {entry['house']}</p>
            <p style="margin: 5px 0;"><strong>Batch:</strong> {entry['batch']}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> {entry['address']}</p>
        """
        
        # Add contact information if provided
        contact_info = []
        if entry.get('email'):
            contact_info.append(f'<p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:{entry["email"]}">{entry["email"]}</a></p>')
        if entry.get('phone'):
            contact_info.append(f'<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:{entry["phone"]}">{entry["phone"]}</a></p>')
        
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
        
        # Create marker with tooltip showing Name - Batch - House
        marker = folium.Marker(
            location=[entry['lat'], entry['lng']],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=f"{entry['name']} - {entry['batch']} - {entry['house']}",
            icon=icon
        )
        
        marker.add_to(marker_cluster)
    
    # Add the marker cluster to the map
    marker_cluster.add_to(m)
    
    # Add FontAwesome CSS for icons
    m.get_root().header.add_child(folium.Element('''
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    '''))
    
    # Save the map
    os.makedirs("assets/maps", exist_ok=True)
    m.save("assets/maps/community_map.html")

if __name__ == "__main__":
    # If running from GitHub Actions, expect event data
    if os.environ.get('GITHUB_EVENT_PATH'):
        with open(os.environ['GITHUB_EVENT_PATH'], 'r') as f:
            event = json.load(f)
            if 'client_payload' in event:
                entry_data = event['client_payload']
                if add_new_entry(entry_data):
                    generate_map()
    else:
        # If running locally, just generate the map
        generate_map() 
        generate_map() 