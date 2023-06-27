import { defineCustomElements } from 'https://www.unpkg.com/@mapsindoors/components/dist/esm/loader.js';
import { placeSearch } from './components/search/search.js';
import { convertColorNameToHex, getLocationsData} from './components/integrationApi/getLocationsData.js';
import useBearerToken from './components/integrationApi/getBearerToken.js';
import updateLocation from './components/integrationApi/updateLocation.js';

const getCoords = (location) => {
  if (location.geometry.type === 'Polygon') {
    return location.properties.anchor.coordinates;
  } else if (location.geometry.type === 'Point') {
    return location.geometry.coordinates;
  }
};

export const handleLocationClick = async (location, mapsIndoorsInstance, mapInstance, bearerToken) => {
  console.log('hi again');
  console.log(location);

  const coords = getCoords(location);
  console.log(coords);

  // Reference the existing elements in the HTML
  const locationImage = document.getElementById('location-image');
  const sidebar = document.querySelector('.sidebar');

  console.log(location.id, location.properties.name);

  // Remove the previous image, if it exists
  if (locationImage && locationImage.parentNode === sidebar) {
    sidebar.removeChild(locationImage);
  }

  // Remove the previous buttons, if they exist
  const previousButtons = sidebar.querySelectorAll('.btn-primary');
  previousButtons.forEach((button) => {
    if (button.parentNode === sidebar) {
      sidebar.removeChild(button);
    }
  });

  // Remove the previous table, if it exists
  const previousTable = document.getElementById('location-info-table');
  if (previousTable && previousTable.parentNode === sidebar) {
    sidebar.removeChild(previousTable);
  }

  // Define timestamp variable to store Unix timestamp
  let timestamp;

  // Define property values with empty strings as default
  let name = location.properties.name;
  let building = location.properties.building;
  let venue = location.properties.venue;
  let floorName = location.properties.floorName;
  let type = location.properties.type;
  let status = getStatus(location) || '';
  let stories = location.properties.fields?.stories?.value || 'Set in CMS';
  let entrances = location.properties.fields?.entrances?.value || 'Set in CMS';
  let exits = location.properties.fields?.exits?.value || 'Set in CMS';
  let lastUpdated = formatDate(location.properties.fields?.lastupdated?.value) || '';
  let frontdoor = location.properties.fields?.frontdoor?.value || '';

  // Create and append the new image to the sidebar
  if (frontdoor) {
    const image = document.createElement('img');
    image.src = frontdoor;
    image.alt = 'Location Image';
    image.width = 400;
    image.height = 400;
    image.id = 'location-image';
    sidebar.appendChild(image);
  }

  // Create and append the new buttons to the sidebar
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Mark as Clear';
  clearButton.classList.add('btn', 'btn-primary');
  clearButton.addEventListener('click', async () => {
    // Store Unix timestamp
    timestamp = Math.floor(Date.now() / 1000);

    // Update the lastupdated property on the client-side
    location.properties.fields.lastupdated = {
      value: timestamp
    };

    // Perform the 'Clear' action
    await updateLocation(
      bearerToken,
      name,
      import.meta.env.VITE_MAPSINDOORS_API_KEY,
      location.id,
      'green',
      timestamp,
      entrances,
      exits,
      stories,
      frontdoor
    );

    mapsIndoorsInstance.setDisplayRule(location.id, {
      visible: true,
      polygonVisible: true,
      polygonFillColor: convertColorNameToHex('green'),
    });

    status = 'Clear'; // Update the status

    // Update the Last Updated property in the table
    lastUpdated = formatDate(timestamp);

    updateStatusAndLastUpdatedFields(); // Update the "Status" and "Last Updated" fields in the table
  });
  sidebar.appendChild(clearButton);

  const notClearButton = document.createElement('button');
  notClearButton.textContent = 'Not Clear';
  notClearButton.classList.add('btn', 'btn-primary');
  notClearButton.addEventListener('click', async () => {
    // Store Unix timestamp
    timestamp = Math.floor(Date.now() / 1000);

    // Update the lastupdated property on the client-side
    location.properties.fields.lastupdated = {
      value: timestamp
    };

    // Perform the 'Not Clear' action
    await updateLocation(
      bearerToken,
      name,
      import.meta.env.VITE_MAPSINDOORS_API_KEY,
      location.id,
      'red',
      timestamp,
      entrances,
      exits,
      stories,
      frontdoor
    );

    mapsIndoorsInstance.setDisplayRule(location.id, {
      visible: true,
      polygonVisible: true,
      polygonFillColor: convertColorNameToHex('red'),
    });

    status = 'Not Clear'; // Update the status

    // Update the Last Updated property in the table
    lastUpdated = formatDate(timestamp);

    updateStatusAndLastUpdatedFields(); // Update the "Status" and "Last Updated" fields in the table
  });
  sidebar.appendChild(notClearButton);

  const lockdownButton = document.createElement('button');
  lockdownButton.textContent = 'Lockdown';
  lockdownButton.classList.add('btn', 'btn-primary');
  lockdownButton.addEventListener('click', async () => {
    // Store Unix timestamp
    timestamp = Math.floor(Date.now() / 1000);

    // Update the lastupdated property on the client-side
    location.properties.fields.lastupdated = {
      value: timestamp
    };

    // Perform the 'Lockdown' action
    await updateLocation(
      bearerToken,
      name,
      import.meta.env.VITE_MAPSINDOORS_API_KEY,
      location.id,
      'orange',
      timestamp,
      entrances,
      exits,
      stories,
      frontdoor
    );

    mapsIndoorsInstance.setDisplayRule(location.id, {
      visible: true,
      polygonVisible: true,
      polygonFillColor: convertColorNameToHex('orange'),
    });

    status = 'Lockdown'; // Update the status

    // Update the Last Updated property in the table
    lastUpdated = formatDate(timestamp);

    updateStatusAndLastUpdatedFields(); // Update the "Status" and "Last Updated" fields in the table
  });
  sidebar.appendChild(lockdownButton);

  // Create the location information table
  const locationInfoTable = document.createElement('table');
  locationInfoTable.id = 'location-info-table';
  locationInfoTable.classList.add('styled-table');

  // Create table rows for each property
  const properties = [
    { name: 'Name', value: name },
    { name: 'Building', value: building },
    { name: 'Venue', value: venue },
    { name: 'Floor Name', value: floorName },
    { name: 'Type', value: type },
    { name: 'Status', value: status, id: 'location-status' },
    { name: 'Stories', value: stories },
    { name: 'Entrances', value: entrances },
    { name: 'Exits', value: exits },
    { name: 'Last Updated', id: 'location-last-updated', value: lastUpdated },
  ];

  properties.forEach((property) => {
    if (property.value !== undefined) {
      const row = document.createElement('tr');

      const propertyNameCell = document.createElement('td');
      propertyNameCell.textContent = property.name;
      row.appendChild(propertyNameCell);

      const propertyValueCell = document.createElement('td');
      propertyValueCell.textContent = property.value;
      if (property.id) {
        propertyValueCell.setAttribute('id', property.id);
      }
      row.appendChild(propertyValueCell);

      locationInfoTable.appendChild(row);
    }
  });

  sidebar.appendChild(locationInfoTable);

  // Function to update the "Status" and "Last Updated" fields in the table
  const updateStatusAndLastUpdatedFields = () => {
    const statusCell = document.getElementById('location-status');
    if (statusCell) {
      statusCell.textContent = status;
    }

    const lastUpdatedCell = document.getElementById('location-last-updated');
    if (lastUpdatedCell) {
      lastUpdatedCell.textContent = lastUpdated;
    }
  };
};



// export const handleLocationClick = async (location, mapsIndoorsInstance, mapInstance, bearerToken) => {
//   console.log('hi again');
//   console.log(location);

//   const coords = getCoords(location);
//   console.log(coords);

//   // Reference the existing elements in the HTML
//   const locationImage = document.getElementById('location-image');
//   const sidebar = document.querySelector('.sidebar');

//   console.log(location.id, location.properties.name);

//   // Remove the previous buttons, if they exist
//   const previousButtons = sidebar.querySelectorAll('.btn-primary');
//   previousButtons.forEach((button) => {
//     sidebar.removeChild(button);
//   });

//   // Remove the previous table, if it exists
//   const previousTable = document.getElementById('location-info-table');
//   if (previousTable) {
//     sidebar.removeChild(previousTable);
//   }

//   // Define timestamp variable to store Unix timestamp
//   let timestamp;

//   // Define property values with empty strings as default
//   let name = location.properties.name;
//   let building = location.properties.building;
//   let venue = location.properties.venue;
//   let floorName = location.properties.floorName;
//   let type = location.properties.type;
//   let status = getStatus(location) || '';
//   let stories = location.properties.fields?.stories?.value || 'Set in CMS';
//   let entrances = location.properties.fields?.entrances?.value || 'Set in CMS';
//   let exits = location.properties.fields?.exits?.value || 'Set in CMS';
//   let lastUpdated = formatDate(location.properties.fields?.lastupdated?.value) || '';

//   // Create and append the new buttons to the sidebar
//   const clearButton = document.createElement('button');
//   clearButton.textContent = 'Mark as Clear';
//   clearButton.classList.add('btn', 'btn-primary');
//   clearButton.addEventListener('click', async () => {
//     // Store Unix timestamp
//     timestamp = Math.floor(Date.now() / 1000);

//     // Update the lastupdated property on the client-side
//     location.properties.fields.lastupdated = {
//       value: timestamp
//     };

//     // Perform the 'Clear' action
//     await updateLocation(
//       bearerToken,
//       name,
//       import.meta.env.VITE_MAPSINDOORS_API_KEY,
//       location.id,
//       'green',
//       timestamp,
//       entrances,
//       exits,
//       stories
//     );

//     mapsIndoorsInstance.setDisplayRule(location.id, {
//       visible: true,
//       polygonVisible: true,
//       polygonFillColor: convertColorNameToHex('green'),
//     });

//     status = 'Clear'; // Update the status

//     // Update the Last Updated property in the table
//     lastUpdated = formatDate(timestamp);

//     updateStatusAndLastUpdatedFields(); // Update the "Status" and "Last Updated" fields in the table
//   });
//   sidebar.appendChild(clearButton);

//   const notClearButton = document.createElement('button');
//   notClearButton.textContent = 'Not Clear';
//   notClearButton.classList.add('btn', 'btn-primary');
//   notClearButton.addEventListener('click', async () => {
//     // Store Unix timestamp
//     timestamp = Math.floor(Date.now() / 1000);

//     // Update the lastupdated property on the client-side
//     location.properties.fields.lastupdated = {
//       value: timestamp
//     };

//     // Perform the 'Not Clear' action
//     await updateLocation(
//       bearerToken,
//       name,
//       import.meta.env.VITE_MAPSINDOORS_API_KEY,
//       location.id,
//       'red',
//       timestamp,
//       entrances,
//       exits,
//       stories
//     );

//     mapsIndoorsInstance.setDisplayRule(location.id, {
//       visible: true,
//       polygonVisible: true,
//       polygonFillColor: convertColorNameToHex('red'),
//     });

//     status = 'Not Clear'; // Update the status

//     // Update the Last Updated property in the table
//     lastUpdated = formatDate(timestamp);

//     updateStatusAndLastUpdatedFields(); // Update the "Status" and "Last Updated" fields in the table
//   });
//   sidebar.appendChild(notClearButton);

//   const lockdownButton = document.createElement('button');
//   lockdownButton.textContent = 'Lockdown';
//   lockdownButton.classList.add('btn', 'btn-primary');
//   lockdownButton.addEventListener('click', async () => {
//     // Store Unix timestamp
//     timestamp = Math.floor(Date.now() / 1000);

//     // Update the lastupdated property on the client-side
//     location.properties.fields.lastupdated = {
//       value: timestamp
//     };

//     // Perform the 'Lockdown' action
//     await updateLocation(
//       bearerToken,
//       name,
//       import.meta.env.VITE_MAPSINDOORS_API_KEY,
//       location.id,
//       'orange',
//       timestamp,
//       entrances,
//       exits,
//       stories
//     );

//     mapsIndoorsInstance.setDisplayRule(location.id, {
//       visible: true,
//       polygonVisible: true,
//       polygonFillColor: convertColorNameToHex('orange'),
//     });

//     status = 'Lockdown'; // Update the status

//     // Update the Last Updated property in the table
//     lastUpdated = formatDate(timestamp);

//     updateStatusAndLastUpdatedFields(); // Update the "Status" and "Last Updated" fields in the table
//   });
//   sidebar.appendChild(lockdownButton);

//   // Create the location information table
//   const locationInfoTable = document.createElement('table');
//   locationInfoTable.id = 'location-info-table'; // Set id for the table
//   locationInfoTable.classList.add('styled-table');

//   // Create table rows for each property
//   const properties = [
//     { name: 'Name', value: name },
//     { name: 'Building', value: building },
//     { name: 'Venue', value: venue },
//     { name: 'Floor Name', value: floorName },
//     { name: 'Type', value: type },
//     { name: 'Status', value: status, id: 'location-status' }, // Add id for the status row
//     { name: 'Stories', value: stories },
//     { name: 'Entrances', value: entrances },
//     { name: 'Exits', value: exits },
//     { name: 'Last Updated', id: 'location-last-updated', value: lastUpdated }, // Add id for the last updated row
//   ];

//   properties.forEach((property) => {
//     if (property.value !== undefined) {
//       const row = document.createElement('tr');

//       const propertyNameCell = document.createElement('td');
//       propertyNameCell.textContent = property.name;
//       row.appendChild(propertyNameCell);

//       const propertyValueCell = document.createElement('td');
//       propertyValueCell.textContent = property.value;
//       if (property.id) {
//         propertyValueCell.setAttribute('id', property.id); // Set id for the status and last updated rows
//       }
//       row.appendChild(propertyValueCell);

//       locationInfoTable.appendChild(row);
//     }
//   });

//   sidebar.appendChild(locationInfoTable);

//   // Function to update the "Status" and "Last Updated" fields in the table
//   const updateStatusAndLastUpdatedFields = () => {
//     const statusCell = document.getElementById('location-status');
//     if (statusCell) {
//       statusCell.textContent = status;
//     }

//     const lastUpdatedCell = document.getElementById('location-last-updated');
//     if (lastUpdatedCell) {
//       lastUpdatedCell.textContent = lastUpdated;
//     }
//   };
// };




const getStatus = (location) => {
  const colorProperty = location.properties.fields?.colorProperty?.value;
  switch (colorProperty) {
    case 'red':
      return 'Not Clear';
    case 'green':
      return 'Clear';
    case 'orange':
      return 'Lockdown';
    default:
      return '';
  }
};



const formatDate = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleString('en-US', options);
};
defineCustomElements();

document.addEventListener('DOMContentLoaded', async function () {
  const miMapElement = document.querySelector('mi-map-mapbox');

  if (miMapElement) {
    miMapElement.setAttribute('access-token', import.meta.env.VITE_MAPBOX_TOKEN);
    miMapElement.setAttribute('mi-api-key', import.meta.env.VITE_MAPSINDOORS_API_KEY);
  }

  let mapInstance = null;
  let mapsIndoorsInstance = null;
  let desiredVenueName = 'ESPERANZA_CROSSING';

  const waitForMapsIndoorsReady = () => {
    return new Promise((resolve, reject) => {
      miMapElement.addEventListener('mapsIndoorsReady', () => {
        resolve();
      });
    });
  };

  const initializeApp = async () => {
    try {
      await waitForMapsIndoorsReady();
      mapInstance = await miMapElement.getMapInstance();
      mapsIndoorsInstance = await miMapElement.getMapsIndoorsInstance();
      mapsIndoorsInstance.setBuildingOutlineOptions({
        strokeColor: '#000000'
      });
      miMapElement.polygonHighlightOptions = null;
      mapsIndoorsInstance.setDisplayRule(['MI_BUILDING', 'MI_VENUE'], {
        visible: false
      });

      const venues = await mapsindoors.services.VenuesService.getVenues();
      let desiredVenue = venues.find((venue) => venue.name === desiredVenueName);
      if (desiredVenue) {
        const venue = await mapsindoors.services.VenuesService.getVenue(desiredVenue.id);

        const venueDefaultBearing = parseFloat(venue.venueInfo.fields.defaultBearing.value);
        const venueDefaultLat = parseFloat(venue.venueInfo.fields.defaultLat.value);
        const venueDefaultLng = parseFloat(venue.venueInfo.fields.defaultLng.value);
        const venueDefaultPitch = parseFloat(venue.venueInfo.fields.defaultPitch.value);
        const venueDefaultZoom = parseFloat(venue.venueInfo.fields.defaultZoom.value);

        console.log(venueDefaultBearing, venueDefaultLat, venueDefaultLng, venueDefaultPitch, venueDefaultZoom);
        mapInstance.setZoom(venueDefaultZoom);
        mapInstance.setCenter({
          lat: venueDefaultLat,
          lng: venueDefaultLng
        });
        mapInstance.setBearing(venueDefaultBearing);
        mapInstance.setPitch(venueDefaultPitch);

        // Fetch the bearer token
        useBearerToken(async (bearerToken) => {
          // Fetch the locations data
          const apiKey = import.meta.env.VITE_MAPSINDOORS_API_KEY;
          await getLocationsData(apiKey, mapsIndoorsInstance); // Pass mapsIndoorsInstance to the function

          // Update the click event listener
          mapsIndoorsInstance.addListener('click', async (location) => {
            await handleLocationClick(location, mapsIndoorsInstance, mapInstance, bearerToken);
          });
        });
      } else {
        console.log('Desired venue not found.');
      }
    } catch (error) {
      console.error('MapsIndoors instance is not ready:', error);
    }
  };

  initializeApp();
});