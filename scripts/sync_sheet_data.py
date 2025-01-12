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
        'number': row['Number (e.g. 87)'],
        'house': row['House'],
        'batch': row['Batch (e.g. 2020)'],
        'address': row['Address (e.g. "5 Leighton St, Cambridge, MA, USA" or "C-19, Madhur Green Villas, Ram Ganga Vihar, Moradabad, Uttar Pradesh, India", or simply the city "Meerut, Uttar Pradesh, India")'],
        'email': row.get('Email (If you are open to people connecting with you)', ''),
        'phone': row.get('Phone Number (if you are open to people connecting with you; please add the country code such as +91 before noting the phone number)', ''),
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
    
    try:
        # Load existing data
        existing_data = load_existing_data()
        print(f"Loaded {len(existing_data)} existing entries")
        
        # Fetch sheet data
        sheet_data = get_sheet_data()
        print(f"Fetched {len(sheet_data)} entries from sheet")
        
        # Print first row headers for debugging
        if sheet_data:
            print("Available columns:", list(sheet_data[0].keys()))
        
        # Track new entries
        new_entries = []
        
        # Process each sheet entry
        for i, row in enumerate(sheet_data):
            try:
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
                else:
                    print(f"Warning: Could not geocode address for entry {i + 1}: {entry['name']}")
            except KeyError as e:
                print(f"Error processing row {i + 1}: Missing column {str(e)}")
                print(f"Row data: {row}")
                raise
            except Exception as e:
                print(f"Error processing row {i + 1}: {str(e)}")
                print(f"Row data: {row}")
                raise
        
        # If we have new entries, update the data and regenerate the map
        if new_entries:
            print(f"Adding {len(new_entries)} new entries")
            existing_data.extend(new_entries)
            save_data(existing_data)
            generate_map()
            print("Map updated successfully")
        else:
            print("No new entries to add")
            
    except Exception as e:
        print(f"Error during sync: {str(e)}")
        raise

if __name__ == "__main__":
    sync_data() 