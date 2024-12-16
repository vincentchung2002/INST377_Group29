const express = require("express");
const supabaseClient = require("@supabase/supabase-js");
const bodyParser = require("body-parser");

require("dotenv").config();

const init = require(__dirname + "/init.js");
const helpers = require(__dirname + "/helpers.js");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

init.initNetworks(supabase, "https://api.citybik.es/v2/networks");

app.get("/api/bikes/networks/default", async (req, res) => {
    const networks = await helpers.getFirstFewNetworks(100, supabase);
    res.send(networks);
});

app.get("/api/bikes/networks/search", async (req, res) => {

    res.send(await helpers.getFirstFewNetworks(100, supabase));
});

app.get("/api/bikes/stations", async (req, res) => {
    if (!req.query["network_id"]) {
        res.status(404);
        res.send("Missing parameter: network_id");
        return;
    }
    const stations = await helpers.getStations(req.query["network_id"].toLocaleLowerCase(), supabase, "https://api.citybik.es/v2/networks/");
    res.send(stations);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

