const updateLocation = async (bearerToken, name, apiKey, locationId, polygonFill, lastUpdateTimestamp, entrances, exits, stories, frontdoor) => {
  const payload = [{
    id: locationId,
    properties: {
      'name@en': name,
      'colorProperty@en': polygonFill,
      'lastupdated@en': lastUpdateTimestamp,
      'entrances@en': entrances || '',
      'exits@en': exits || '',
      'stories@en': stories || '',
      'frontdoor@en': frontdoor || '',
    }
  }];

  try {
    const response = await fetch(`https://integration.mapsindoors.com/${apiKey}/api/geodata`, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Authorization': bearerToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('Update successful');
    } else {
      console.error('Update failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

export default updateLocation;
