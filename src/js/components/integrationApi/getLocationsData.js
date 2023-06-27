const colorMapping = {
  green: '#00FF00',
  red: '#FF0000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  cyan: '#00FFFF',
  gray: '#808080',
  brown: '#A52A2A',
  black: '#000000',
  white: '#FFFFFF',
  magenta: '#FF00FF',
  lime: '#00FF00',
  teal: '#008080',
  Green: '#00FF00',
  Red: '#FF0000',
  Blue: '#0000FF',
  Yellow: '#FFFF00',
  Orange: '#FFA500',
  Purple: '#800080',
  Pink: '#FFC0CB',
  Cyan: '#00FFFF',
  Gray: '#808080',
  Brown: '#A52A2A',
  Black: '#000000',
  White: '#FFFFFF',
  Magenta: '#FF00FF',
  Lime: '#00FF00',
  Teal: '#008080',
};

export const convertColorNameToHex = (colorName) => {
  return colorMapping[colorName] || '#FFFFFF'; // Default to white if color name is not found
};

const updateMap = (locations, mapsIndoorsInstance) => {
  // Perform the logic to update the map with the location data
  console.log('Updating map with locations:', locations);

  locations.forEach(location => {
    mapsIndoorsInstance.setDisplayRule(location.id, {
      visible: true,
      polygonVisible: true,
      polygonFillColor: location.colorProperty,
    });
    console.log(`Set display rule for location ID: ${location.id}`);
  });
};

// Rest of the code remains the same...

export const getLocationsData = (apiKey, mapsIndoorsInstance) => {
  const fetchLocationsData = async () => {
    try {
      const response = await fetch(`https://integration.mapsindoors.com/${apiKey}/api/geodata?rootElements=bb7de4664d424814a7c93fe8`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Locations Data:', data);

      // Filter the locations based on the presence of colorProperty in properties
      const locationsArray = data
        .filter(location => location.properties && (location.properties['colorProperty@en'] || location.properties['colorproperty@en']))
        .map(location => ({
          id: location.id,
          baseType: location.baseType,
          name: location.properties['name@en'],
          colorProperty: convertColorNameToHex(location.properties['colorproperty@en'] || location.properties['colorProperty@en'] || ''),
          // Add other properties you need
        }));

      console.log('Locations Array:', locationsArray);

      // Call a function or perform operations with the filtered locations array
      // e.g., update map with location data using mapsIndoorsInstance
      updateMap(locationsArray, mapsIndoorsInstance);
    } catch (error) {
      console.error('Error fetching locations data:', error);
    }
  };

  // Fetch locations data immediately
  fetchLocationsData();

  // Fetch locations data every 7 seconds
  setInterval(fetchLocationsData, 10000);
};

export default getLocationsData;
