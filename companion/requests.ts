import { XmlToJsonParser, JsonToXmlParser } from './parser';

/**
 * Executes a GET request to an API endpoint.
 * @param headers The headers to send along with the request.
 * @param url The url to perform the request against.
 */
const performGetRequest = (headers: HeaderMap, url: string) => {

    const payload: RequestInit  = { 
        headers,
        method: "GET",
    };

    return executeRequest(url, payload);
}

/**
 * Executes a POST request to an API endpoint.
 * @param headers The headers to send along with the request.
 * @param url The url to perform the request against.
 * @param body The request body, in a JS object.
 */
export const performPostRequest = (headers: HeaderMap, url: string, body: object) => {

    const payload: RequestInit  = { 
        body: JsonToXmlParser(body),
        headers,
        method: "POST",
    };

    return executeRequest(url, payload);
}

/**
 * Function to execute the request against the API.
 * @param url The url to perform the request against.
 * @param payload The payload to submit with the request.
 */
const executeRequest = (url: string, payload: RequestInit) => {

    return fetch(url, payload)
        .then((response: Response) => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then((responseData) => {
            return XmlToJsonParser(responseData);
        });
};      