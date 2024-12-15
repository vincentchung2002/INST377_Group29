const express = require("express");
const supabaseClient = require("@supabase/supabase-js");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const supabaseUrl = "https://fbqdpuemmxhtrauhodec.supabase.co";
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZicWRwdWVtbXhodHJhdWhvZGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyODQzNDMsImV4cCI6MjA0OTg2MDM0M30.pUD3sqfRkxbFuspCwfsGS7SspjcmDlj0EAVbDHyh8yY;
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
