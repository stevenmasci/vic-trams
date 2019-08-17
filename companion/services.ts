import { performPostRequest } from './requests';

const baseUrl = "https://ws.tramtracker.com.au";
const endpoints = {
    pidsService: "/pidsservice/pids.asmx",
}

const defaultUrl = baseUrl + endpoints.pidsService;
const defaultHeaders: HeaderMap = {
    "Content-Type": "application/soap+xml; charset=utf-8",
}

const getXmlNamespace = () => {
    return {
        "@_xmlns": "http://www.yarratrams.com.au/pidsservice/"
    };
}

const getEnvelopeProperties = () => {
    return {
        "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "@_xmlns:soap12": "http://www.w3.org/2003/05/soap-envelope",
    };
}

const getSoapHeader = (clientGuid: string) => {
    return {
        "soap12:Header": {
            "PidsClientHeader": {
                        "@_xmlns": "http://www.yarratrams.com.au/pidsservice/",
                        "ClientGuid": clientGuid,
                        "ClientType": "WEBPID",
                        "ClientVersion": 1,
                        "ClientWebServiceVersion": "6.4.0.0"
            }
        }
    };
};

/**
 * Get a new client GUID.
 */
export const getNewClientGuid = async () => {
    const body = {
        "soap12:Envelope": {
            ...getEnvelopeProperties(),
            "soap12:Body": {
                "GetNewClientGuid": {
                    ...getXmlNamespace(),
                }
            }
        }
    };

    const response = await performPostRequest(defaultHeaders, defaultUrl, body);
    return response
        ["soap:Envelope"]
        ["soap:Body"]
        ["GetNewClientGuidResponse"]
        ["GetNewClientGuidResult"];
}

/**
 * Get all tram routes.
 * @param clientGuid Globally Unique Identifier (GUID) for the client application.
 */
export const getRouteSummaries = async (clientGuid: string) => {
    const body = {
        "soap12:Envelope": {
            ...getEnvelopeProperties(),
            ...getSoapHeader(clientGuid),
            "soap12:Body": {
                "GetRouteSummaries": {
                    ...getXmlNamespace(),
                }
            }
        }
    };

    const response = await performPostRequest(defaultHeaders, defaultUrl, body);
    return response
        ["soap:Envelope"]
        ["soap:Body"]
        ["GetRouteSummariesResponse"]
        ["GetRouteSummariesResult"]
        ["diffgr:diffgram"]
        ["DocumentElement"]
        ["RouteSummaries"];
}

/**
 * Get a list of stop information for the specified route and direction.
 * @param clientGuid Globally Unique Identifier (GUID) for the client application.
 * @param routeNo The route to get stop information for.
 * @param isUpDirection Towards the city.
 */
export const getRouteStopsByRoute = async (clientGuid: string, routeNo: string | number, 
    isUpDirection: boolean) => {

    const body = {
        "soap12:Envelope": {
            ...getEnvelopeProperties(),
            ...getSoapHeader(clientGuid),
            "soap12:Body": {
                "GetRouteStopsByRoute": {
                    ...getXmlNamespace(),
                    "routeNo": routeNo,
                }
            }
        }
    };

    const response = await performPostRequest(defaultHeaders, defaultUrl, body);
    return response
        ["soap:Envelope"]
        ["soap:Body"]
        ["GetRouteStopsByRouteResponse"]
        ["GetRouteStopsByRouteResult"]
        ["diffgr:diffgram"]
        ["DocumentElement"]
        ["S"].filter((stop: any) => isUpDirection === stop.UpStop);
}

/**
 * Get tram arrival time and information for a specific stop.
 * @param clientGuid Globally Unique Identifier (GUID) for the client application.
 * @param stopNo Get the arrival times for this stop number.
 */
export const getNextPredictedRoutesCollection = async (clientGuid: string, stopNo: number) => {
    const body = {
        "soap12:Envelope": {
            ...getEnvelopeProperties(),
            ...getSoapHeader(clientGuid),
            "soap12:Body": {
                "GetNextPredictedRoutesCollection": {
                    ...getXmlNamespace(),
                    "stopNo": stopNo,
                    "routeNo": 0,
                    "lowFloor": false
                }
            }
        }
    };

    const response = await performPostRequest(defaultHeaders, defaultUrl, body);
    return response
        ["soap:Envelope"]
        ["soap:Body"]
        ["GetNextPredictedRoutesCollectionResponse"]
        ["GetNextPredictedRoutesCollectionResult"]
        ["diffgr:diffgram"]
        ["DocumentElement"]
        ["ToReturn"];
}

/**
 * Get the predicted arrival times for each stop for a specific tram.
 * @param clientGuid Globally Unique Identifier (GUID) for the client application.
 * @param tramNo Get the predicted arrival times for this tram number.
 */
export const getNextPredictedArrivalTimeAtStopsForTramNo = async (clientGuid: string, tramNo: number) => {
    const body = {
        "soap12:Envelope": {
            ...getEnvelopeProperties(),
            ...getSoapHeader(clientGuid),
            "soap12:Body": {
                "GetNextPredictedArrivalTimeAtStopsForTramNo": {
                    ...getXmlNamespace(),
                    "tramNo": tramNo,
                }
            }
        }
    };

    const response = await performPostRequest(defaultHeaders, defaultUrl, body);
    return response
        ["soap:Envelope"]
        ["soap:Body"]
        ["GetNextPredictedArrivalTimeAtStopsForTramNoResponse"]
        ["GetNextPredictedArrivalTimeAtStopsForTramNoResult"]
        ["diffgr:diffgram"]
        ["NewDataSet"]
        ["NextPredictedStopsDetailsTable"];
}

/**
 * Get the tram stop name by providing the stop number and the list of stops. Return undefined if
 * the stop number cannot be found.
 * @param routeStopsByRoute The list of route stops that contains all the stop names.
 * @param stopNo Get the stop name for this stop number.
 */
export const getStopNameByStopNo = (routeStopsByRoute: any, stopNo: number) => {
    const stopDetails = routeStopsByRoute.find((stop: any) => stop.TID === stopNo);

    return stopDetails ? stopDetails.StopName : undefined;
}