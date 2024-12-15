const express = require("express");
const supabaseClient = require("@supabase/supabase-js");
const bodyParser = require("body-parser");

const init = require(__dirname + "/init.js");
const helpers = require(__dirname + "/helpers.js");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const supabaseUrl = "https://fbqdpuemmxhtrauhodec.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZicWRwdWVtbXhodHJhdWhvZGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyODQzNDMsImV4cCI6MjA0OTg2MDM0M30.pUD3sqfRkxbFuspCwfsGS7SspjcmDlj0EAVbDHyh8yY";
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
    console.log(`App is listening on port ${port}`);
});