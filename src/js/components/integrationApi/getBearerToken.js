let bearerToken = null;

const useBearerToken = (callback) => {
  if (bearerToken) {
    // If the bearer token is already available, use it
    callback(bearerToken);
  } else {
    const miUsername = import.meta.env.VITE_MAPSINDOORS_USERNAME;
    const miPassword = import.meta.env.VITE_MAPSINDOORS_PASSWORD;

    const getToken = async () => {
      const response = await fetch('https://auth.mapsindoors.com/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `client_id=client&username=${miUsername}&grant_type=password&password=${miPassword}`
      });
      const json = await response.json();
      bearerToken = `Bearer ${json.access_token}`;
      callback(bearerToken);
    };

    getToken();
  }
};

export default useBearerToken;
