async function getStations(name_id, supabase, bikeStationApiStem) {
    const { data, error } = await supabase
        .from("stations")
        .select()
        .eq("name_id", name_id);
    if (error) {
        console.log(error);
    }
    if (data) {
        return data;
    }
    const newStations = await fetch(`${bikeStationApiStem}${name_id}`)
        .then(res => res.json())
        .then(res => res["network"]["stations"]);
    for (const s of newStations.values()) {
        const { error } = await supabase
            .from("stations")
            .insert({
                id: s["id"],
                name_id: name_id,
                name: s["name"],
                lat: s["latitude"],
                lng: s["longitude"],
                free_bikes: s["free_bikes"],
                empty_slots: s["empty_slots"],
                timestamp: s["timestamp"],
            });
        if (error) {
            console.error(error);
        }
    }
}

async function getFirstFewNetworks(num, supabase) {
    const { data, error } = await supabase
        .from("networks")
        .select()
        .limit(num);
    return data;
}

async function searchNetworks(queries, supabase) {
    const textSearchConfig = {
        type: "websearch",
        config: "english",
    };
    let results = [];
    if (queries["latitude"]) {
        const { data, error } = await supabase.from("networks").select().eq("lat", queries["latitude"]);
        results.concat(data);
    }
    if (queries["longitude"]) {
        const { data, error } = await supabase.from("networks").select().eq("lng", queries["longitude"]);
        results.concat(data);
    }
    let loc_results = [];
    if (queries["location"]) {
        const { d1, e1 } = await supabase.from("networks").select()
            .textSearch("city", queries["name"], textSearchConfig);
        const { d2, e2 } = await supabase.from("networks").select()
            .textSearch("country", queries["name"], textSearchConfig);
        loc_results.concat(d1, d2);
    }
    let name_results = null;
    if (queries["name"]) {
        let { d1, e1 } = await supabase.from("networks").select()
            .textSearch("name", queries["name"], textSearchConfig);
        let { d2, e2 } = await supabase.from("networks").select()
            .textSearch("name", queries["name_id"], textSearchConfig);
        let { d3, e3 } = await supabase.from("networks").select()
            .textSearch("name", queries["company"], textSearchConfig);
        name_results.concat(d1, d2, d3);
    }
    if (loc_results && name_results) {
        results.concat(loc_results.filter(elem => (array2.indexOf(elem) !== -1)));
    } else if (loc_results) {
        results.concat(loc_results);
    } else {
        results.concat(name_results);
    }
    return new Array(new Set(results));
}

module.exports = { getStations, getFirstFewNetworks, searchNetworks };