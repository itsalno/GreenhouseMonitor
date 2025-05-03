import {useEffect} from "react";
import {weatherStationClient,sensorDataClient} from "../apiControllerClients.ts";
import {useAtom} from "jotai";
import {DeviceLogsAtom, JwtAtom,SensorDataAtom} from "../atoms.ts";

export default function useInitializeData() {

    const [jwt] = useAtom(JwtAtom);
    const [, setLogs] = useAtom(SensorDataAtom)

    useEffect(() => {
        if (jwt == null || jwt.length < 1)
            return;
        sensorDataClient.getSensorLogs(jwt).then(r => {
            setLogs(r || []);
        })
    }, [jwt])

}