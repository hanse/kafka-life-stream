const fetch = require('../node-fetch-json');
const API_URL = 'https://www.strava.com/api/v3';

function getActivity(accessToken, activityId) {
  return fetch(`${API_URL}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => response.jsonData);
}

module.exports = {
  getActivity
};
