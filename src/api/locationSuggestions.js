
const PHOTON_URL = "https://photon.komoot.io/api/";

export async function searchLocations(query, signal) {
  const url = new URL(PHOTON_URL);

  url.searchParams.set("q", query.trim());
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", "en");

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Failed to load location suggestions");
  }

  const data = await response.json();

  return (data.features || []).map((feature, index) => {
    const properties = feature.properties;
    const coordinates = feature.geometry.coordinates;

    return {
      id: `${properties.osm_type || "place"}-${properties.osm_id || index}`,
      name: properties.name || properties.city || properties.county || "Unknown place",
      country: properties.country || "",
      region:
        properties.state ||
        properties.county ||
        properties.district ||
        "",
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
  });
}
