import json
import os
import folium
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

def geocode_address(address):
    """Geocode an address using OpenStreetMap's Nominatim service."""
    geolocator = Nominatim(user_agent="community_map")
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
    
    m = folium.Map(location=[center_lat, center_lng], zoom_start=4)
    
    # Add markers for each entry
    for entry in data:
        # Create popup content with contact information
        popup_html = f"""
        <strong>{entry['name']}</strong><br>
        Number: {entry['number']}<br>
        House: {entry['house']}<br>
        Batch: {entry['batch']}<br>
        Address: {entry['address']}
        """
        
        # Add contact information if provided
        contact_info = []
        if entry.get('email'):
            contact_info.append(f'Email: <a href="mailto:{entry["email"]}">{entry["email"]}</a>')
        if entry.get('phone'):
            contact_info.append(f'Phone: <a href="tel:{entry["phone"]}">{entry["phone"]}</a>')
        
        if contact_info:
            popup_html += '<div style="margin-top:5px;padding-top:5px;border-top:1px solid #eee;">'
            popup_html += '<br>'.join(contact_info)
            popup_html += '</div>'
        
        folium.Marker(
            [entry['lat'], entry['lng']],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=entry['name']
        ).add_to(m)
    
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