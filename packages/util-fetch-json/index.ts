import 'isomorphic-fetch';

type HttpResponse = Response & {
  jsonData: any;
  textString: string;
};

class HttpError extends Error {
  response: HttpResponse;
  constructor(response: HttpResponse) {
    super(`${response.status}: ${response.textString}`);
    this.response = response;
  }
}

function fetchJSON(url: string, options: RequestInit): Promise<HttpResponse> {
  return fetch(url, options).then((response: HttpResponse) => {
    return response.text().then(responseText => {
      try {
        response.jsonData = JSON.parse(responseText);
      } catch (error) {}

      response.textString = responseText;

      if (!response.ok) {
        throw new HttpError(response);
      }

      return response;
    });
  });
}

export default fetchJSON;
