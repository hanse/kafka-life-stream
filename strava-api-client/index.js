require('isomorphic-fetch');

const API_URL = 'https://www.strava.com/api/v3';

function getActivity(accessToken, activityId) {
  return fetch(`${API_URL}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => response.json());
}

module.exports = {
  getActivity
};
