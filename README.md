Demo found at

https://mapsindoorsincidentmanagement.vercel.app/

# MapsIndoors Incident Management

This is a web application for incident management using the MapsIndoors platform.

## Overview

The MapsIndoors Incident Management application provides a user interface to manage incidents in a specific venue or building. It allows users to view and update the status of locations within the venue, track the last update timestamp, and visualize the status of locations on a map.

## Features

- Display locations within a venue/building
- Update the status of locations (Clear, Not Clear, Lockdown)
- Track the last update timestamp of locations
- Visualize location status on the map

## Installation

1. Clone the repository:

git clone https://github.com/cuellarirobert/mapsindoorsincidentmanagement.git


2. Install the dependencies:

npm install


3. Set up the required environment variables:
- `VITE_MAPSINDOORS_API_KEY`: MapsIndoors API key
- `VITE_MAPBOX_TOKEN`: Mapbox access token
- `VITE_MAPSINDOORS_USERNAME`: MapsIndoors username (for CMS and integration API access)
- `VITE_MAPSINDOORS_PASSWORD`: MapsIndoors password (for CMS and integration API access)

4. Build and run the application:

npm run build
npm run start

## Managing Properties

The properties of locations, such as `propertyColor`, `stories`, `entrances`, `exits`, and `lastupdated`, should be managed in the MapsIndoors CMS. Make sure to update these properties in the CMS to reflect the correct information in the application.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvement, please submit an issue or a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
