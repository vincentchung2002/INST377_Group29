const express = require("express");
const supabaseClient = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
require('dotenv').config(); 

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

async function fetchNetworksFromAPI() {
    try {
        const response = await fetch('https://api.citybik.es/v2/networks');
        const data = await response.json();
        return data.networks;
    } catch (error) {
        console.error('Error fetching networks:', error);
        return null;
    }
}

app.get("/api/bikes/networks/default", async (req, res) => {
    try {
        const networks = await fetchNetworksFromAPI();
        if (networks) {
            res.json({ networks });
        } else {
            res.status(500).json({ error: 'Failed to fetch networks' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/api/bikes/networks/search", (req, res) => {
    res.send("search");
});

app.get("/api/bikes/stations", (req, res) => {
    res.send("stations");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

