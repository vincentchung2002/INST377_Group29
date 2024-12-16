# INST377_Group29

# CityBike Finder
# https://inst-377-group29-o3zunwutv-vincentchung2002s-projects.vercel.app/

## Description
CityBike Finder is a web application that helps users locate available rental bikes from public bike share systems worldwide. The application provides real-time information about bike networks and station availability, leveraging the CityBikes API and Supabase for efficient data management. Users can search for bike networks by name or location and get detailed information about station status and bike availability.

## Target Browsers
Our application is optimized for:
* Desktop browsers:
   * Chrome 
   * Firefox 
   * Safari 
   * Edge 
* Mobile browsers:
   * iOS Safari
   * Chrome for Android

## Developer Manual

### Installation
1. Clone the repository:
```
git clone https://github.com/vincentchung2002/INST377_Group29.git
cd INST377_Group29
```

2. Install dependencies:
```
npm install nodemon
npm install express
npm install @supabase/supabase-js
npm install dotenv
```

3. Set up environment variables:
   * Create a `.env` file in the root directory
   * Add the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Running the Application
1. Start the development server:
```
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

### API Endpoints

#### GET /api/bikes/networks/default
- Returns the first 50 bike networks
- No parameters required
- Response includes network name, location, and company information

#### GET /api/bikes/networks/search
- Searches networks by name and location
- Query parameters:
  - `name`: (optional) Network name to search for
  - `location`: (optional) Location to search for
- Returns filtered list of networks matching search criteria

#### GET /api/bikes/stations
- Returns stations for a specific network
- Query parameters:
  - `network_id`: (required) ID of the network
- Returns list of stations with bike availability and location data

### Data Structure
Networks:
```
{
  "networks": [{
    "name_id": "network-id",
    "name": "Network Name",
    "company": "Company Name",
    "city": "City Name",
    "country": "Country Code",
    "lat": latitude,
    "lng": longitude
  }]
}
```

Stations:
```
{
  "stations": [{
    "id": "station-id",
    "name": "Station Name",
    "name_id": "network-id",
    "free_bikes": number,
    "empty_slots": number,
    "lat": latitude,
    "lng": longitude,
    "timestamp": "ISO timestamp"
  }]
}
```

### Known Bugs
1. Search results may take a moment to update due to API response times
2. Station timestamps might show in UTC instead of local time
3. Some networks may have incomplete company information

### Future Development
1. Short-term improvements:
   - Add map visualization for stations
   - Add favorite networks functionality
   - Improve mobile responsiveness

2. Long-term goals:
   - Add real-time updates
   - Implement user accounts
   - Add journey planning features
