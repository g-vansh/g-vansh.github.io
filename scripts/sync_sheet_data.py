import os
import json
import requests
from datetime import datetime
from generate_map import geocode_address, randomize_location, generate_map

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

def get_sheet_data():
    """Fetch data from Google Sheet."""
    sheet_url = os.environ.get('SHEET_URL')
    if not sheet_url:
        raise ValueError("SHEET_URL environment variable not set")
    
    response = requests.get(sheet_url)
    response.raise_for_status()
    return response.json()

def format_sheet_entry(row):
    """Format a sheet row into a map entry."""
    return {
        'name': row['Name'],
        'number': row['School Number'],
        'house': row['House'],
        'batch': row['Batch Year'],
        'address': row['Current Address'],
        'email': row.get('Email', ''),
        'phone': row.get('Phone Number', ''),
        'timestamp': row.get('Timestamp', datetime.now().strftime("%m/%d/%Y %H:%M:%S"))
    }

def entry_exists(entry, existing_data):
    """Check if an entry already exists in the data."""
    for existing in existing_data:
        if (existing['name'] == entry['name'] and 
            existing['number'] == entry['number'] and 
            existing['batch'] == entry['batch']):
            return True
    return False

def sync_data():
    """Sync sheet data with map data."""
    print("Starting data sync...")
    
    # Load existing data
    existing_data = load_existing_data()
    print(f"Loaded {len(existing_data)} existing entries")
    
    # Fetch sheet data
    sheet_data = get_sheet_data()
    print(f"Fetched {len(sheet_data)} entries from sheet")
    
    # Track new entries
    new_entries = []
    
    # Process each sheet entry
    for row in sheet_data:
        entry = format_sheet_entry(row)
        
        # Skip if entry already exists
        if entry_exists(entry, existing_data):
            continue
        
        # Geocode address
        coordinates = geocode_address(entry['address'])
        if coordinates:
            lat, lng = coordinates
            # Store original coordinates
            entry['original_lat'] = lat
            entry['original_lng'] = lng
            # Randomize location
            rand_lat, rand_lng = randomize_location(lat, lng)
            entry['lat'] = rand_lat
            entry['lng'] = rand_lng
            new_entries.append(entry)
    
    # If we have new entries, update the data and regenerate the map
    if new_entries:
        print(f"Adding {len(new_entries)} new entries")
        existing_data.extend(new_entries)
        save_data(existing_data)
        generate_map()
        print("Map updated successfully")
    else:
        print("No new entries to add")

if __name__ == "__main__":
    sync_data() 