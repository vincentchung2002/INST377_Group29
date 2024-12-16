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
    let results = [];
    if (queries["latitude"]) {
        const { data, error } = await supabase.from("networks").select().eq("lat", queries["latitude"]);
        results.concat(data);
    }
    if (queries["longitude"]) {
        const { data, error } = await supabase.from("networks").select().eq("lng", queries["longitude"]);
        results.concat(data);
    }
    if (queries["latitude"]) {
        const { data, error } = await supabase.from("networks").select().eq("lat", queries["latitude"]);
        results.concat(data);
    }
    let loc_results = [];
    if (queries["location"]) {
        const { data, error } = await supabase.from("networks").select()
            .textSearch("city", queries["name"], {
                type: "websearch",
                config: "english",
            });
        loc_results.concat(data);
    }
    let name_results = [];
    if (queries["name"]) {
        let { data, error } = await supabase.from("networks").select()
            .textSearch("name", queries["name"], {
                type: "websearch",
                config: "english",
            });
        name_results.concat(data);
    }
    return results + loc_results + name_results;
}

module.exports = { getStations, getFirstFewNetworks, searchNetworks };