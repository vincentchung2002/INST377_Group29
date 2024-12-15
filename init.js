async function initNetworks(supabase, bikeNetworksApi) {
    const { count, error } = await supabase
        .from("networks")
        .select("*", { count: "estimated", head: true });
    if (error) {
        console.error(error);
        return;
    }
    if (count > 0) {
        return;
    }
    const networks = await fetch(bikeNetworksApi)
        .then(res => res.json())
        .then(res => res["networks"]);
    for (const nw of networks.values()) {
        const { error } = await supabase
            .from("networks")
            .insert({
                name_id: nw["id"],
                name: nw["name"],
                company: nw["company"],
                lat: nw["location"]["latitude"],
                lng: nw["location"]["longitude"],
                city: nw["location"]["city"],
                country: nw["location"]["country"],
            });
        if (error) {
            console.error(error);
        }
    }
}

module.exports = { initNetworks };