import { useWsClient } from "ws-request-hook";
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {
    AdminHasDeletedData,
    ServerBroadcastsLiveDataToDashboard,
    StringConstants,
} from "../generated-client.ts";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { DeviceLogsAtom, JwtAtom, SensorDataAtom } from "../atoms.ts";
import { sensorDataClient } from "../apiControllerClients.ts";

export default function AdminDashboard() {
    const { onMessage, readyState } = useWsClient();
    const [deviceLogs, setDeviceLogs] = useAtom(DeviceLogsAtom);
    const [sensorData, setSensorData] = useAtom(SensorDataAtom);
    const [jwt] = useAtom(JwtAtom);

    const [windowStatus, setWindowStatus] = useState<"open" | "closed">("closed");

    if (!jwt || jwt.length < 1) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-600 text-xl">
                🌱 Please sign in to continue monitoring the greenhouse.
            </div>
        );
    }

    useEffect(() => {
        if (readyState !== 1 || !jwt) return;
        const unsubscribe = onMessage<ServerBroadcastsLiveDataToDashboard>(
            StringConstants.ServerBroadcastsLiveDataToDashboard,
            (dto) => {
                toast.success("📡 New data received!");
                setSensorData(dto.logs || []);

                const latest = dto.logs?.[dto.logs.length - 1];
                if (latest?.window != null) {
                    setWindowStatus(latest.window ? "open" : "closed");
                }
            }
        );
        return () => unsubscribe();
    }, [readyState, jwt]);

    
    useEffect(() => {
        if (readyState !== 1 || !jwt) return;
        const unsubscribe = onMessage<AdminHasDeletedData>(
            StringConstants.AdminHasDeletedData,
            () => {
                toast("⚠️ All sensor data has been deleted.");
                setSensorData([]);
            }
        );
        return () => unsubscribe();
    }, [readyState, jwt]);

    const chartData = sensorData.map((item) => ({
        time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "Unknown",
        temperature: item.temperature,
        humidity: item.humidity,
        soilMoisture: item.soil,
    }));

    return (
        <div className="min-h-screen bg-green-50 px-4 py-8">
            <h1 className="text-3xl font-extrabold text-green-800 text-center mb-10">
                🌿 Greenhouse Admin Dashboard
            </h1>

            {/* Controls */}
            <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
                <button
                    onClick={() => {
                        sensorDataClient
                            .deleteSensorData(localStorage.getItem("jwt")!)
                            .then(() => toast.success("🗑️ Data deleted successfully"))
                            .catch(() => toast.error("❌ Failed to delete data"));
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow-md transition"
                >
                    Delete All Sensor Data
                </button>

                <div
                    className={`px-4 py-2 rounded-xl text-white shadow-md font-semibold ${
                        windowStatus === "open"
                            ? "bg-green-600"
                            : "bg-gray-500"
                    }`}
                >
                    🪟 Window is {windowStatus.toUpperCase()}
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-6xl mx-auto">
                <h2 className="text-xl font-semibold text-green-700 mb-4">
                    📊 Sensor Metrics Over Time
                </h2>
                <ResponsiveContainer width="100%" height={420}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="temperature"
                            fill="#f97316" // orange-500
                            name="Temperature (°C)"
                            activeBar={<Rectangle fill="#fed7aa" stroke="#ea580c" />}
                        />
                        <Bar
                            dataKey="humidity"
                            fill="#60a5fa" // blue-400
                            name="Humidity (%)"
                            activeBar={<Rectangle fill="#dbeafe" stroke="#2563eb" />}
                        />
                        <Bar
                            dataKey="soilMoisture"
                            fill="#34d399" // green-400
                            name="Soil Moisture (%)"
                            activeBar={<Rectangle fill="#bbf7d0" stroke="#059669" />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
