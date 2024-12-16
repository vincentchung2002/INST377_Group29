const express = require("express");
const supabaseClient = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
require("dotenv").config();

const init = require("./init.js");
const helpers = require("./helpers.js");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const supabase = supabaseClient.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

init.initNetworks(supabase, "https://api.citybik.es/v2/networks");

app.get("/api/bikes/networks/default", async (req, res) => {
    try {
        const networks = await helpers.getFirstFewNetworks(50, supabase);
        res.json({ networks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch networks' });
    }
});

app.get("/api/bikes/networks/search", async (req, res) => {
    try {
        if (!req.query.name && !req.query.location) {
            const networks = await helpers.getFirstFewNetworks(50, supabase);
            return res.json({ networks });
        }
        
        const networks = await helpers.searchNetworks(req.query, supabase);
        res.json({ networks });
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

app.get("/api/bikes/stations", async (req, res) => {
    try {
        if (!req.query.network_id) {
            return res.status(400).json({ error: 'Missing network_id parameter' });
        }
        
        const stations = await helpers.getStations(
            req.query.network_id.toLowerCase(),
            supabase,
            "https://api.citybik.es/v2/networks/"
        );
        
        res.json({ stations });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stations' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
