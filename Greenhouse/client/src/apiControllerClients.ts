import {AuthClient, SubscriptionClient,SensorClient, ThresholdsClient} from "./generated-client.ts";
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const prod = import.meta.env.PROD;

function ensureProtocol(url: string) {
  if (url.startsWith("http")) return url;
  return (prod ? "https://" : "http://") + url;
}

export const subscriptionClient = new SubscriptionClient(ensureProtocol(baseUrl));
export const sensorDataClient = new SensorClient(ensureProtocol(baseUrl));
export const authClient = new AuthClient(ensureProtocol(baseUrl));
export const thresholdsClient = new ThresholdsClient(ensureProtocol(baseUrl));
console.log("authClient:", authClient);