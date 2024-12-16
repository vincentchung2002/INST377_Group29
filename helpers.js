async function getStations(name_id, supabase, bikeStationApiStem) {
    try {
        const { data, error } = await supabase
            .from("stations")
            .select()
            .eq("name_id", name_id);
            
        if (error) throw error;
        if (data && data.length > 0) return data;

        const response = await fetch(`${bikeStationApiStem}${name_id}`);
        const json = await response.json();
        const stations = json.network.stations;


        const stationsToInsert = stations.map(s => ({
            id: s.id,
            name_id: name_id,
            name: s.name,
            lat: s.latitude,
            lng: s.longitude,
            free_bikes: s.free_bikes,
            empty_slots: s.empty_slots,
            timestamp: s.timestamp
        }));

        const { error: insertError } = await supabase
            .from("stations")
            .insert(stationsToInsert);

        if (insertError) console.error('Cache insert error:', insertError);
        
        return stations;
    } catch (error) {
        console.error('Error in getStations:', error);
        throw error;
    }
}

async function getFirstFewNetworks(num, supabase) {
    try {
        const { data, error } = await supabase
            .from("networks")
            .select()
            .order('city')
            .limit(num);
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error in getFirstFewNetworks:', error);
        throw error;
    }
}

async function searchNetworks(queries, supabase) {
    try {
        let query = supabase.from("networks").select();
        
        if (queries.name) {
            query = query.ilike('name_id', `%${queries.name}%`);
        } else if (queries.location) {
            query = query.or(`city.ilike.%${queries.location}%,country.ilike.%${queries.location}%`);
        }

        const { data, error } = await query.order('city').limit(50);
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Search networks error:', error);
        throw error;
    }
}

module.exports = { getStations, getFirstFewNetworks, searchNetworks };
