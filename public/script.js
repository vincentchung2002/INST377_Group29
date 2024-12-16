document.addEventListener('DOMContentLoaded', () => {
    fetchNetworks();
    setupSearch();
});

async function fetchNetworks() {
    try {
        const data = await fetch('/api/bikes/networks/default')
            .then(response => response.json());
        displayNetworks(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayNetworks(networks) {
    const container = document.getElementById('networksContainer');
    container.innerHTML = networks.map(network => `
        <div class="network-card" data-network-id="${network.name_id}">
            <div class="network-name">${network.name}</div>
            <div class="network-location">Location: ${network.city}, ${network.country}</div>
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
    const latitudeSearch = document.getElementById('latitudeSearch');
    const longitudeSearch = document.getElementById('longitudeSearch');

    networkSearch.addEventListener('input', filterNetworks);
    locationSearch.addEventListener('input', filterNetworks);
    latitudeSearch.addEventListener('input', filterNetworks);
    longitudeSearch.addEventListener('input', filterNetworks);
}

async function filterNetworks() {
    const networkQuery = document.getElementById('networkSearch').value.toLowerCase();
    const locationQuery = document.getElementById('locationSearch').value.toLowerCase();
    const latitudeQuery = document.getElementById('latitudeSearch').value;
    const longitudeQuery = document.getElementById('longitudeSearch').value;
    
    const networks = await fetch(`/api/bikes/networks/search?name=${networkQuery}&location=${locationQuery}&latitude=${latitudeQuery}&longitude=${longitudeQuery}`);
    displayNetworks(networks);
}

async function fetchStations(networkId) {
    try {
        const data = await fetch(`/api/bikes/stations?network_id=${networkId}`)
            .then(response => response.json());
        displayStations(networkId, data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayStations(networkId, stations) {
    const container = document.getElementById('stationsContainer');
    container.innerHTML = `
        <h2>Stations in the ${networkId} network</h2>
        <div class="stations-grid">
            ${stations.map(station => `
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
