document.addEventListener('DOMContentLoaded', () => {
    fetchNetworks();
    setupSearch();
});

async function fetchNetworks() {
    try {
        const response = await fetch('/api/bikes/networks/default');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (data && data.networks) {
            displayNetworks(data.networks);
        }
    } catch (error) {
        console.error('Error fetching networks:', error);
        showError('networksContainer', 'Failed to load networks. Please try again later.');
    }
}

function displayNetworks(networks) {
    const container = document.getElementById('networksContainer');
    
    if (!networks || networks.length === 0) {
        container.innerHTML = '<p>No networks found</p>';
        return;
    }

    container.innerHTML = networks.map(network => `
        <div class="network-card" data-network-id="${network.name_id}">
            <div class="network-name">${network.name || 'Unnamed Network'}</div>
            <div class="network-location">Location: ${network.city || 'Unknown City'}, ${network.country || 'Unknown Country'}</div>
            <div class="network-company">Network Company: ${network.company || 'Unknown Operator'}</div>
        </div>
    `).join('');

    document.querySelectorAll('.network-card').forEach(card => {
        card.addEventListener('click', async () => {
            document.querySelectorAll('.network-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const networkId = card.dataset.networkId;
            await fetchStations(networkId);
        });
    });
}

function setupSearch() {
    const networkSearch = document.getElementById('networkSearch');
    const locationSearch = document.getElementById('locationSearch');

    function debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const performSearch = debounce(() => {
        const name = networkSearch.value.trim();
        const location = locationSearch.value.trim();
        
        if (name || location) {
            searchNetworks(name, location);
        } else {
            fetchNetworks();
        }
    }, 300);

    networkSearch.addEventListener('input', performSearch);
    locationSearch.addEventListener('input', performSearch);
}

async function searchNetworks(name, location) {
    try {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (location) params.append('location', location);

        const response = await fetch(`/api/bikes/networks/search?${params}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        if (data && data.networks) {
            displayNetworks(data.networks);
        }
    } catch (error) {
        console.error('Error searching networks:', error);
        showError('networksContainer', 'Search failed. Please try again.');
    }
}

async function fetchStations(networkId) {
    try {
        const response = await fetch(`/api/bikes/stations?network_id=${networkId}`);
        if (!response.ok) throw new Error('Failed to fetch stations');
        
        const data = await response.json();
        if (data && data.stations) {
            displayStations(data.stations);
        }
    } catch (error) {
        console.error('Error fetching stations:', error);
        showError('stationsContainer', 'Failed to load stations. Please try again.');
    }
}

function displayStations(stations) {
    const container = document.getElementById('stationsContainer');
    
    if (!stations || stations.length === 0) {
        container.innerHTML = '<p>No stations found for this network</p>';
        return;
    }

    const totalBikes = stations.reduce((sum, station) => sum + (station.free_bikes || 0), 0);
    const totalSlots = stations.reduce((sum, station) => sum + (station.empty_slots || 0), 0);

    container.innerHTML = `
        <h2>Available Stations</h2>
        <div class="network-summary">
            <p>Total Available Bikes: ${totalBikes}</p>
            <p>Total Empty Slots: ${totalSlots}</p>
        </div>
        <div class="stations-grid">
            ${stations.map(station => `
                <div class="station-card">
                    <div class="station-name">${station.name || 'Unnamed Station'}</div>
                    <div class="station-stats">
                        <div class="stat-label">Available Bikes:</div>
                        <div class="stat-value">${station.free_bikes || 0}</div>
                        <div class="stat-label">Empty Slots:</div>
                        <div class="stat-value">${station.empty_slots || 0}</div>
                    </div>
                    <div class="station-location">
                        <div class="stat-label">Location:</div>
                        <div class="stat-value">Lat: ${station.lat}, Lng: ${station.lng}</div>
                    </div>
                    <div class="timestamp">
                        Last Updated: ${new Date(station.timestamp).toLocaleString()}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showError(containerId, message) {
    document.getElementById(containerId).innerHTML = `
        <p class="error-message">${message}</p>
    `;
}
