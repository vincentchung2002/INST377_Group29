document.addEventListener('DOMContentLoaded', () => {
    fetchNetworks();
    setupSearch();
});

async function fetchNetworks() {
    try {
        const response = await fetch('/api/bikes/networks/default');
        const data = await response.json();
        displayNetworks(data.networks);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayNetworks(networks) {
    const container = document.getElementById('networksContainer');
    container.innerHTML = networks.map(network => `
        <div class="network-card" data-network-id="${network.id}">
            <div class="network-name">${network.name}</div>
            <div class="network-location">Location: ${network.location.city}, ${network.location.country}</div>
        </div>
    `).join('');

    // Add click listeners to each network card
    document.querySelectorAll('.network-card').forEach(card => {
        card.addEventListener('click', () => {
            const networkId = card.dataset.networkId;
            fetchStations(networkId);
        });
    });
}

function setupSearch() {
    const networkSearch = document.getElementById('networkSearch');
    const locationSearch = document.getElementById('locationSearch');

    networkSearch.addEventListener('input', filterNetworks);
    locationSearch.addEventListener('input', filterNetworks);
}

function filterNetworks() {
    const networkQuery = document.getElementById('networkSearch').value.toLowerCase();
    const locationQuery = document.getElementById('locationSearch').value.toLowerCase();
    
    document.querySelectorAll('.network-card').forEach(card => {
        const name = card.querySelector('.network-name').textContent.toLowerCase();
        const location = card.querySelector('.network-location').textContent.toLowerCase();
        
        const matchesNetwork = name.includes(networkQuery);
        const matchesLocation = location.includes(locationQuery);
        
        card.style.display = (matchesNetwork && matchesLocation) ? 'block' : 'none';
    });
}

async function fetchStations(networkId) {
    try {
        const response = await fetch(`/api/bikes/stations?network_id=${networkId}`);
        const data = await response.json();
        displayStations(data.network);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayStations(network) {
    const container = document.getElementById('stationsContainer');
    container.innerHTML = `
        <h2>${network.name} Stations</h2>
        <div class="stations-grid">
            ${network.stations.map(station => `
                <div class="station-card">
                    <h3>${station.name}</h3>
                    <p>Free Bikes: ${station.free_bikes}</p>
                    <p>Empty Slots: ${station.empty_slots}</p>
                    <p>Last Updated: ${new Date(station.timestamp).toLocaleString()}</p>
                </div>
            `).join('')}
        </div>
    `;
}
