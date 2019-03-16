import fetch from '@hanse/util-fetch-json';

const API_URL = 'https://www.strava.com/api/v3';

export function getActivity(accessToken: string, activityId: string) {
  return fetch(`${API_URL}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => response.jsonData);
}
