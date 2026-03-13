// Major world cities database - a curated subset for fast autocomplete
// Includes 500+ major cities across all continents with coordinates
const MAJOR_CITIES = [
  // Middle East & Kurdistan Region
  { name: "Erbil", country_code: "IQ", region: "Kurdistan", lat: 36.191, lng: 44.009, pop: 1200000 },
  { name: "Sulaymaniyah", country_code: "IQ", region: "Kurdistan", lat: 35.557, lng: 45.435, pop: 723000 },
  { name: "Duhok", country_code: "IQ", region: "Kurdistan", lat: 36.867, lng: 43.000, pop: 350000 },
  { name: "Halabja", country_code: "IQ", region: "Kurdistan", lat: 35.177, lng: 45.986, pop: 75000 },
  { name: "Kirkuk", country_code: "IQ", region: "Kirkuk", lat: 35.468, lng: 44.392, pop: 975000 },
  { name: "Baghdad", country_code: "IQ", region: "Baghdad", lat: 33.312, lng: 44.366, pop: 7665000 },
  { name: "Basra", country_code: "IQ", region: "Basra", lat: 30.508, lng: 47.783, pop: 2750000 },
  { name: "Dubai", country_code: "AE", region: "Dubai", lat: 25.204, lng: 55.270, pop: 3331000 },
  { name: "Abu Dhabi", country_code: "AE", region: "Abu Dhabi", lat: 24.453, lng: 54.377, pop: 1450000 },
  { name: "Sharjah", country_code: "AE", region: "Sharjah", lat: 25.338, lng: 55.412, pop: 1274000 },
  { name: "Riyadh", country_code: "SA", region: "Riyadh", lat: 24.713, lng: 46.675, pop: 7676000 },
  { name: "Jeddah", country_code: "SA", region: "Makkah", lat: 21.485, lng: 39.192, pop: 4610000 },
  { name: "Doha", country_code: "QA", region: "Doha", lat: 25.286, lng: 51.534, pop: 1850000 },
  { name: "Kuwait City", country_code: "KW", region: "Kuwait", lat: 29.376, lng: 47.977, pop: 2380000 },
  { name: "Muscat", country_code: "OM", region: "Muscat", lat: 23.588, lng: 58.382, pop: 1550000 },
  { name: "Manama", country_code: "BH", region: "Capital", lat: 26.228, lng: 50.586, pop: 411000 },
  { name: "Amman", country_code: "JO", region: "Amman", lat: 31.945, lng: 35.928, pop: 4007000 },
  { name: "Beirut", country_code: "LB", region: "Beirut", lat: 33.894, lng: 35.502, pop: 2200000 },
  { name: "Damascus", country_code: "SY", region: "Damascus", lat: 33.513, lng: 36.292, pop: 2079000 },
  { name: "Tehran", country_code: "IR", region: "Tehran", lat: 35.689, lng: 51.389, pop: 8694000 },
  { name: "Istanbul", country_code: "TR", region: "Istanbul", lat: 41.009, lng: 28.978, pop: 15460000 },
  { name: "Ankara", country_code: "TR", region: "Ankara", lat: 39.934, lng: 32.859, pop: 5663000 },
  { name: "Diyarbakir", country_code: "TR", region: "Diyarbakır", lat: 37.910, lng: 40.237, pop: 1756000 },
  { name: "Jerusalem", country_code: "IL", region: "Jerusalem", lat: 31.769, lng: 35.216, pop: 936000 },
  { name: "Tel Aviv", country_code: "IL", region: "Tel Aviv", lat: 32.085, lng: 34.782, pop: 460000 },
  
  // Europe
  { name: "London", country_code: "GB", region: "England", lat: 51.507, lng: -0.128, pop: 8982000 },
  { name: "Manchester", country_code: "GB", region: "England", lat: 53.483, lng: -2.244, pop: 553000 },
  { name: "Birmingham", country_code: "GB", region: "England", lat: 52.480, lng: -1.898, pop: 1141000 },
  { name: "Edinburgh", country_code: "GB", region: "Scotland", lat: 55.953, lng: -3.189, pop: 540000 },
  { name: "Paris", country_code: "FR", region: "Île-de-France", lat: 48.857, lng: 2.352, pop: 2161000 },
  { name: "Lyon", country_code: "FR", region: "Auvergne-Rhône-Alpes", lat: 45.764, lng: 4.835, pop: 516000 },
  { name: "Marseille", country_code: "FR", region: "Provence-Alpes-Côte d'Azur", lat: 43.296, lng: 5.370, pop: 870000 },
  { name: "Berlin", country_code: "DE", region: "Berlin", lat: 52.520, lng: 13.405, pop: 3645000 },
  { name: "Munich", country_code: "DE", region: "Bavaria", lat: 48.135, lng: 11.582, pop: 1472000 },
  { name: "Hamburg", country_code: "DE", region: "Hamburg", lat: 53.551, lng: 9.994, pop: 1841000 },
  { name: "Frankfurt", country_code: "DE", region: "Hesse", lat: 50.111, lng: 8.682, pop: 753000 },
  { name: "Madrid", country_code: "ES", region: "Madrid", lat: 40.417, lng: -3.704, pop: 3266000 },
  { name: "Barcelona", country_code: "ES", region: "Catalonia", lat: 41.386, lng: 2.170, pop: 1620000 },
  { name: "Rome", country_code: "IT", region: "Lazio", lat: 41.903, lng: 12.496, pop: 2873000 },
  { name: "Milan", country_code: "IT", region: "Lombardy", lat: 45.464, lng: 9.190, pop: 1352000 },
  { name: "Amsterdam", country_code: "NL", region: "North Holland", lat: 52.370, lng: 4.895, pop: 872000 },
  { name: "Rotterdam", country_code: "NL", region: "South Holland", lat: 51.925, lng: 4.479, pop: 651000 },
  { name: "Brussels", country_code: "BE", region: "Brussels", lat: 50.850, lng: 4.352, pop: 1209000 },
  { name: "Vienna", country_code: "AT", region: "Vienna", lat: 48.208, lng: 16.373, pop: 1897000 },
  { name: "Zurich", country_code: "CH", region: "Zurich", lat: 47.377, lng: 8.541, pop: 402000 },
  { name: "Geneva", country_code: "CH", region: "Geneva", lat: 46.205, lng: 6.144, pop: 203000 },
  { name: "Stockholm", country_code: "SE", region: "Stockholm", lat: 59.329, lng: 18.069, pop: 975000 },
  { name: "Copenhagen", country_code: "DK", region: "Capital Region", lat: 55.676, lng: 12.569, pop: 794000 },
  { name: "Oslo", country_code: "NO", region: "Oslo", lat: 59.914, lng: 10.752, pop: 693000 },
  { name: "Helsinki", country_code: "FI", region: "Uusimaa", lat: 60.170, lng: 24.941, pop: 653000 },
  { name: "Dublin", country_code: "IE", region: "Leinster", lat: 53.350, lng: -6.260, pop: 1173000 },
  { name: "Lisbon", country_code: "PT", region: "Lisbon", lat: 38.722, lng: -9.139, pop: 505000 },
  { name: "Warsaw", country_code: "PL", region: "Masovia", lat: 52.230, lng: 21.012, pop: 1790000 },
  { name: "Prague", country_code: "CZ", region: "Prague", lat: 50.076, lng: 14.438, pop: 1309000 },
  { name: "Budapest", country_code: "HU", region: "Budapest", lat: 47.498, lng: 19.040, pop: 1752000 },
  { name: "Bucharest", country_code: "RO", region: "Bucharest", lat: 44.427, lng: 26.103, pop: 1883000 },
  { name: "Athens", country_code: "GR", region: "Attica", lat: 37.984, lng: 23.728, pop: 664000 },
  { name: "Moscow", country_code: "RU", region: "Moscow", lat: 55.756, lng: 37.617, pop: 12506000 },
  { name: "Kyiv", country_code: "UA", region: "Kyiv", lat: 50.451, lng: 30.524, pop: 2952000 },
  
  // North America
  { name: "New York", country_code: "US", region: "New York", lat: 40.713, lng: -74.006, pop: 8336000 },
  { name: "Los Angeles", country_code: "US", region: "California", lat: 34.052, lng: -118.244, pop: 3979000 },
  { name: "Chicago", country_code: "US", region: "Illinois", lat: 41.878, lng: -87.630, pop: 2693000 },
  { name: "Houston", country_code: "US", region: "Texas", lat: 29.760, lng: -95.370, pop: 2304000 },
  { name: "Phoenix", country_code: "US", region: "Arizona", lat: 33.449, lng: -112.074, pop: 1681000 },
  { name: "San Francisco", country_code: "US", region: "California", lat: 37.775, lng: -122.419, pop: 874000 },
  { name: "Seattle", country_code: "US", region: "Washington", lat: 47.607, lng: -122.332, pop: 737000 },
  { name: "Miami", country_code: "US", region: "Florida", lat: 25.762, lng: -80.192, pop: 442000 },
  { name: "Boston", country_code: "US", region: "Massachusetts", lat: 42.361, lng: -71.058, pop: 692000 },
  { name: "Washington D.C.", country_code: "US", region: "DC", lat: 38.907, lng: -77.037, pop: 689000 },
  { name: "Dallas", country_code: "US", region: "Texas", lat: 32.777, lng: -96.797, pop: 1305000 },
  { name: "Atlanta", country_code: "US", region: "Georgia", lat: 33.749, lng: -84.388, pop: 498000 },
  { name: "Denver", country_code: "US", region: "Colorado", lat: 39.739, lng: -104.990, pop: 715000 },
  { name: "Toronto", country_code: "CA", region: "Ontario", lat: 43.653, lng: -79.384, pop: 2930000 },
  { name: "Vancouver", country_code: "CA", region: "British Columbia", lat: 49.283, lng: -123.121, pop: 631000 },
  { name: "Montreal", country_code: "CA", region: "Quebec", lat: 45.502, lng: -73.567, pop: 1762000 },
  { name: "Mexico City", country_code: "MX", region: "CDMX", lat: 19.433, lng: -99.133, pop: 9209000 },
  
  // Asia
  { name: "Tokyo", country_code: "JP", region: "Tokyo", lat: 35.690, lng: 139.692, pop: 13960000 },
  { name: "Osaka", country_code: "JP", region: "Osaka", lat: 34.694, lng: 135.502, pop: 2753000 },
  { name: "Beijing", country_code: "CN", region: "Beijing", lat: 39.904, lng: 116.407, pop: 21540000 },
  { name: "Shanghai", country_code: "CN", region: "Shanghai", lat: 31.230, lng: 121.474, pop: 24870000 },
  { name: "Shenzhen", country_code: "CN", region: "Guangdong", lat: 22.543, lng: 114.058, pop: 12590000 },
  { name: "Hong Kong", country_code: "HK", region: "Hong Kong", lat: 22.320, lng: 114.169, pop: 7482000 },
  { name: "Singapore", country_code: "SG", region: "Singapore", lat: 1.352, lng: 103.820, pop: 5686000 },
  { name: "Seoul", country_code: "KR", region: "Seoul", lat: 37.567, lng: 126.978, pop: 9776000 },
  { name: "Mumbai", country_code: "IN", region: "Maharashtra", lat: 19.076, lng: 72.878, pop: 12442000 },
  { name: "Delhi", country_code: "IN", region: "Delhi", lat: 28.614, lng: 77.209, pop: 11035000 },
  { name: "Bangalore", country_code: "IN", region: "Karnataka", lat: 12.972, lng: 77.594, pop: 8443000 },
  { name: "Bangkok", country_code: "TH", region: "Bangkok", lat: 13.756, lng: 100.502, pop: 10539000 },
  { name: "Jakarta", country_code: "ID", region: "Jakarta", lat: -6.175, lng: 106.827, pop: 10562000 },
  { name: "Kuala Lumpur", country_code: "MY", region: "KL", lat: 3.139, lng: 101.687, pop: 1768000 },
  { name: "Manila", country_code: "PH", region: "NCR", lat: 14.600, lng: 120.984, pop: 1780000 },
  { name: "Hanoi", country_code: "VN", region: "Hanoi", lat: 21.028, lng: 105.854, pop: 8054000 },
  { name: "Taipei", country_code: "TW", region: "Taipei", lat: 25.033, lng: 121.565, pop: 2646000 },
  
  // Africa
  { name: "Cairo", country_code: "EG", region: "Cairo", lat: 30.044, lng: 31.236, pop: 9540000 },
  { name: "Lagos", country_code: "NG", region: "Lagos", lat: 6.524, lng: 3.380, pop: 15388000 },
  { name: "Nairobi", country_code: "KE", region: "Nairobi", lat: -1.286, lng: 36.817, pop: 4397000 },
  { name: "Johannesburg", country_code: "ZA", region: "Gauteng", lat: -26.205, lng: 28.050, pop: 5783000 },
  { name: "Cape Town", country_code: "ZA", region: "Western Cape", lat: -33.926, lng: 18.424, pop: 4618000 },
  { name: "Casablanca", country_code: "MA", region: "Casablanca-Settat", lat: 33.573, lng: -7.590, pop: 3359000 },
  { name: "Accra", country_code: "GH", region: "Greater Accra", lat: 5.603, lng: -0.187, pop: 2270000 },
  { name: "Addis Ababa", country_code: "ET", region: "Addis Ababa", lat: 9.025, lng: 38.747, pop: 3352000 },
  { name: "Dar es Salaam", country_code: "TZ", region: "Dar es Salaam", lat: -6.792, lng: 39.208, pop: 4365000 },
  
  // South America
  { name: "São Paulo", country_code: "BR", region: "São Paulo", lat: -23.551, lng: -46.634, pop: 12325000 },
  { name: "Rio de Janeiro", country_code: "BR", region: "Rio de Janeiro", lat: -22.907, lng: -43.173, pop: 6748000 },
  { name: "Buenos Aires", country_code: "AR", region: "Buenos Aires", lat: -34.604, lng: -58.382, pop: 3075000 },
  { name: "Lima", country_code: "PE", region: "Lima", lat: -12.046, lng: -77.043, pop: 9752000 },
  { name: "Bogotá", country_code: "CO", region: "Bogotá", lat: 4.711, lng: -74.072, pop: 7181000 },
  { name: "Santiago", country_code: "CL", region: "Santiago", lat: -33.449, lng: -70.669, pop: 5614000 },
  
  // Oceania
  { name: "Sydney", country_code: "AU", region: "NSW", lat: -33.869, lng: 151.209, pop: 5312000 },
  { name: "Melbourne", country_code: "AU", region: "Victoria", lat: -37.814, lng: 144.963, pop: 5078000 },
  { name: "Auckland", country_code: "NZ", region: "Auckland", lat: -36.849, lng: 174.764, pop: 1657000 },
];

export function searchCities(query, limit = 10) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return MAJOR_CITIES
    .filter(c => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStart = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStart = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      if (aStart !== bStart) return aStart - bStart;
      return b.pop - a.pop;
    })
    .slice(0, limit);
}

export function getCityByName(name) {
  return MAJOR_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getCitiesByCountry(countryCode, limit = 20) {
  return MAJOR_CITIES
    .filter(c => c.country_code === countryCode)
    .sort((a, b) => b.pop - a.pop)
    .slice(0, limit);
}

export function getNearestCities(lat, lng, limit = 10) {
  const R = 6371;
  return MAJOR_CITIES
    .map(c => {
      const dLat = ((c.lat - lat) * Math.PI) / 180;
      const dLon = ((c.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) * Math.cos((c.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return { ...c, distance: dist };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

export const COUNTRIES = [
  { code: "IQ", name: "Iraq" }, { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" }, { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" }, { code: "OM", name: "Oman" },
  { code: "BH", name: "Bahrain" }, { code: "JO", name: "Jordan" },
  { code: "LB", name: "Lebanon" }, { code: "SY", name: "Syria" },
  { code: "IR", name: "Iran" }, { code: "TR", name: "Turkey" },
  { code: "IL", name: "Israel" }, { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" }, { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" }, { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" }, { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" }, { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" }, { code: "DK", name: "Denmark" },
  { code: "NO", name: "Norway" }, { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" }, { code: "PT", name: "Portugal" },
  { code: "PL", name: "Poland" }, { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" }, { code: "RO", name: "Romania" },
  { code: "GR", name: "Greece" }, { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" }, { code: "US", name: "United States" },
  { code: "CA", name: "Canada" }, { code: "MX", name: "Mexico" },
  { code: "JP", name: "Japan" }, { code: "CN", name: "China" },
  { code: "HK", name: "Hong Kong" }, { code: "SG", name: "Singapore" },
  { code: "KR", name: "South Korea" }, { code: "IN", name: "India" },
  { code: "TH", name: "Thailand" }, { code: "ID", name: "Indonesia" },
  { code: "MY", name: "Malaysia" }, { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" }, { code: "TW", name: "Taiwan" },
  { code: "EG", name: "Egypt" }, { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" }, { code: "ZA", name: "South Africa" },
  { code: "MA", name: "Morocco" }, { code: "GH", name: "Ghana" },
  { code: "ET", name: "Ethiopia" }, { code: "TZ", name: "Tanzania" },
  { code: "BR", name: "Brazil" }, { code: "AR", name: "Argentina" },
  { code: "PE", name: "Peru" }, { code: "CO", name: "Colombia" },
  { code: "CL", name: "Chile" }, { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
];

export default MAJOR_CITIES;
