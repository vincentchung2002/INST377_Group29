async function init_networks(supabase, bikeNetworksApi) {
    const { data, error } = await supabase
        .from("networks")
        .select("*", { count: "exact", head: true });
    if (error) {
        console.error(error);
        return;
    }
    if (data["count"] > 0) {
        return;
    }
    const networks = await fetch(bikeNetworksApi)
        .then(res => res.json())
        .then(res => res["networks"]);
    for (const nw in networks.values()) {
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
            }
        );
        if (error) {
            console.error(error);
            return;
        }
    }
}