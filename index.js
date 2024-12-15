const express = require("express");
const supabaseClient = require("@supabase/supabase-js");
const bodyParser = require("body-parser");

const init = require(__dirname + "/init.js");
const helpers = require(__dirname + "/helpers.js");
require('dotenv').config(); 

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get("/api/bikes/networks/default", (req, res) => {
    init.initNetworks(supabase, "https://api.citybik.es/v2/networks");
    res.send("default");
});

app.get("/api/bikes/networks/search", (req, res) => {
    res.send("search");
});

app.get("/api/bikes/stations", (req, res) => {
    if (!req.query["network_id"]) {
        res.status(404);
        res.send("Missing parameter: network_id");
        return;
    }
    const stations = helpers.getStations(req.query["network_id"].toLocaleLowerCase(), supabase, "https://api.citybik.es/v2/networks/");
    res.send(stations);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

