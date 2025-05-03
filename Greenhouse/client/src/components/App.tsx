import {WsClientProvider} from 'ws-request-hook';
import {useEffect, useState} from "react";
import ApplicationRoutes from "./ApplicationRoutes.tsx";
import {DevTools} from "jotai-devtools";
import 'jotai-devtools/styles.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const wsUrl = import.meta.env.VITE_WS_URL;
const prod = import.meta.env.PROD;

export const randomUid = crypto.randomUUID();

export default function App() {
    const [serverUrl, setServerUrl] = useState<string | undefined>(undefined);
    useEffect(() => {
        // Use dedicated WS URL if defined, otherwise fallback to baseUrl
        const url = wsUrl
            ? wsUrl + '?id=' + randomUid
            : (prod ? 'wss://' + baseUrl + '?id=' + randomUid : 'ws://' + baseUrl + '?id=' + randomUid);
        setServerUrl(url);
    }, [prod, baseUrl, wsUrl]);
    return (<div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-green-300">
        {serverUrl && <WsClientProvider url={serverUrl}>
            <ApplicationRoutes/>
        </WsClientProvider>}
        {!prod && <DevTools/>}
    </div>);
}