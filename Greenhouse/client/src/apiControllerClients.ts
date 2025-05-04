import {AuthClient, SubscriptionClient, WeatherStationClient,SensorClient, ThresholdsClient} from "./generated-client.ts";
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
const baseUrl = import.meta.env.VITE_API_BASE_URL
const prod = import.meta.env.PROD

export const subscriptionClient = new SubscriptionClient(prod ? "https://" + baseUrl : "http://" + baseUrl);
export const sensorDataClient = new SensorClient(prod ? "https://" + baseUrl : "http://" + baseUrl);
export const weatherStationClient = new WeatherStationClient(prod ? "https://" + baseUrl : "http://" + baseUrl);
export const authClient = new AuthClient(prod ? "https://" + baseUrl : "http://" + baseUrl);
export const thresholdsClient = new ThresholdsClient(prod ? "https://" + baseUrl : "http://" + baseUrl);
console.log("authClient:", authClient);