const express = require("express");

const app = express();
const port = 3000;
app.use(express.static(__dirname + "/public"));

const supabaseUrl = "https://fbqdpuemmxhtrauhodec.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get("/api/bikes/networks/default", (req, res) => {
    res.send("default");
});

app.get("/api/bikes/networks/search", (req, res) => {
    res.send("search");
});

app.get("/api/bikes/stations", (req, res) => {
    res.send("stations");
});

app.listen(port, () => {
    console.log("App has started.");
});