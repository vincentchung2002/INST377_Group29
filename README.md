# INST377_Group29

# CityBike Finder

## Description
CityBike Finder is a web application that helps users locate available rental bikes from public bike share systems worldwide. Users can search for bike networks by name or location, view real-time bike availability at different stations, and get detailed information about payment methods and station locations. The application leverages the CityBikes API to provide real-time bike-sharing data from various cities.

## Target Browsers
Our application supports the following browsers:
- Desktop browsers:
  - Chrome 
  - Firefox 
  - Safari 
  - Edge 
- Mobile browsers:
  - iOS Safari 
  - Chrome for Android

## Developer Manual

### Installation
1. Clone the repository:
```
git clone https://github.com/vincentchung2002/INST377_Group29.git
cd INST377_Group29
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
```
SUPABASE_URL= "https://fbqdpuemmxhtrauhodec.supabase.co"
SUPABASE_KEY= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZicWRwdWVtbXhodHJhdWhvZGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyODQzNDMsImV4cCI6MjA0OTg2MDM0M30.pUD3sqfRkxbFuspCwfsGS7SspjcmDlj0EAVbDHyh8yY"
```

### Running the Application
1. Start the development server:
```
npm run dev
```
2. Open your browser and navigate to `http://localhost:3000`

### Running Tests
Execute the test suite:
```
npm test
```

### API Endpoints

#### GET /api/bikes/networks/default
- Returns a list of all bike networks from the database
- No parameters required
- Response format:
```json
{
  "networks": [
    {
      "company": "company_name",
      "href": "/v2/networks/network_id",
      "location": {
        "latitude": 48.856612,
        "city": "City Name",
        "longitude": 2.352233,
        "country": "XXX"
      },
      "name": "Network Name",
      "id": "network_id"
    }
  ]
}
```

#### GET /api/bikes/networks/search
- Searches networks by name and location
- Query parameters:
  - `name`: (optional) Network name to search for
  - `location`: (optional) Location to search for
- Response format: Same as /networks/default

#### GET /api/bikes/stations
- Returns stations for a specific network
- Query parameters:
  - `network_id`: (required) ID of the network to fetch stations for
- Response format:
```json
{
  "network": {
    "name": "Network Name",
    "stations": [
      {
        "name": "Station Name",
        "timestamp": "2024-12-13T12:10:17.622Z",
        "longitude": 2.374340554605615,
        "free_bikes": 1,
        "latitude": 48.83713368945151,
        "empty_slots": 19,
        "id": "station_id"
      }
    ],
    "company": "company_name",
    "location": {
      "latitude": 48.856612,
      "city": "City Name",
      "longitude": 2.352233,
      "country": "XXX"
    },
    "id": "network_id"
  }
}
```

### Known Bugs
1. 

### Future Development Roadmap
1. Short-term improvements:
   - 

2. Long-term goals:
   - 
