async function getStations(name_id, supabase, bikeStationApiStem) {
    const {data, error} = await supabase
        .from("stations")
        .select()
        .eq("name_id", name_id);
    if (error) {
        console.log(error);
    }
    if (data["data"]) {
        return data["data"];
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

module.exports = { getStations };