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
    YAxis,
} from "recharts";
import {
    AdminHasDeletedData,
    ServerBroadcastsLiveDataToDashboard,
    StringConstants,
    SensorData, 
} from "../generated-client.ts";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { JwtAtom, SensorDataAtom } from "../atoms.ts";
import { sensorDataClient } from "../apiControllerClients.ts";
import { Spinner, FullPageSpinner } from "./Spinner.tsx";
import { formatTimestamp } from "./dateFormatter.ts";

interface StatCardProps {
    label: string;
    value: string | number;
    unit: string;
    icon: string; 
    colorClass: string; 
}

const StatCard = ({ label, value, unit, icon, colorClass }: StatCardProps) => (
    <div className={`bg-white p-5 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${colorClass} transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105`}>
        <div className="text-4xl">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-800">
                {typeof value === 'number' && !isNaN(value) ? value.toFixed(1) : value} 
                <span className="text-lg font-normal">{unit}</span>
            </p>
        </div>
    </div>
);

export default function AdminDashboard() {
    const { onMessage, readyState } = useWsClient();
    const [sensorData, setSensorData] = useAtom(SensorDataAtom);
    const [jwt] = useAtom(JwtAtom);
    const [windowStatus, setWindowStatus] = useState<"open" | "closed">("closed");
    const [latestReadings, setLatestReadings] = useState<Partial<SensorData>>({});

    const [isInitialLoading, setIsInitialLoading] = useState(true);

    if (!jwt || jwt.length < 1) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-700 text-xl">
                🌱 Please sign in to continue monitoring the greenhouse.
            </div>
        );
    }

    useEffect(() => {
        if (readyState === 1 && sensorData.length === 0) {
            setIsInitialLoading(true); 
        } else if (sensorData.length > 0) {
            setIsInitialLoading(false);
        }
    }, [readyState, sensorData]);

    useEffect(() => {
        if (readyState !== 1 || !jwt) return;
        const unsubscribe = onMessage<ServerBroadcastsLiveDataToDashboard>(
            StringConstants.ServerBroadcastsLiveDataToDashboard,
            (dto) => {
                if (isInitialLoading) toast.success("📡 Connected! Receiving live data.");
                setIsInitialLoading(false);
                setSensorData(dto.logs || []);

                const latest = dto.logs?.[dto.logs.length - 1];
                if (latest) {
                    setLatestReadings(latest);
                    if (latest.window != null) {
                        setWindowStatus(latest.window ? "open" : "closed");
                    }
                }
            }
        );
        return () => unsubscribe();
    }, [readyState, jwt, isInitialLoading]); 

    useEffect(() => {
        if (readyState !== 1 || !jwt) return;
        const unsubscribe = onMessage<AdminHasDeletedData>(
            StringConstants.AdminHasDeletedData,
            () => {
                toast("⚠️ All sensor data has been deleted.");
                setSensorData([]);
                setLatestReadings({});
            }
        );
        return () => unsubscribe();
    }, [readyState, jwt]);

    const chartData = sensorData.map((item) => ({
        timestamp: item.timestamp,
        temperature: item.temperature,
        humidity: item.humidity,
        soilMoisture: item.soil,
    }));

    if (isInitialLoading && readyState === 1) {
        return <FullPageSpinner message="Connecting to greenhouse & fetching live data..." />;
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center md:text-left">
                🌿 Greenhouse Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    label="Temperature" 
                    value={latestReadings.temperature ?? 'N/A'} 
                    unit="°C" 
                    icon="🌡️" 
                    colorClass="border-red-500"
                />
                <StatCard 
                    label="Humidity" 
                    value={latestReadings.humidity ?? 'N/A'} 
                    unit="%" 
                    icon="💧" 
                    colorClass="border-blue-500"
                />
                <StatCard 
                    label="Soil Moisture" 
                    value={latestReadings.soil ?? 'N/A'} 
                    unit="%" 
                    icon="🌱" 
                    colorClass="border-emerald-500"
                />
                <div className={`bg-white p-5 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${windowStatus === 'open' ? 'border-sky-500' : 'border-slate-500'}`}>
                    <div className={`text-4xl transition-transform duration-300 ${windowStatus === 'open' ? 'rotate-0' : ''}`}>🪟</div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Window Status</p>
                        <p className={`text-2xl font-bold ${windowStatus === 'open' ? 'text-sky-600' : 'text-slate-700'}`}>
                            {windowStatus.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end items-center mb-6 p-4 bg-white rounded-lg shadow">
                <button
                    onClick={() => {
                        sensorDataClient
                            .deleteSensorData(localStorage.getItem("jwt")!)
                            .then(() => toast.success("🗑️ Data deleted successfully"))
                            .catch(() => toast.error("❌ Failed to delete data"));
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition w-full md:w-auto"
                >
                    Delete All Sensor Data
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
                <h2 className="text-2xl font-semibold text-green-600 mb-6">
                    📊 Sensor Metrics Over Time
                </h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}> 
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                                dataKey="timestamp"
                                tickFormatter={(tick) => formatTimestamp(tick)} 
                                angle={-35}
                                textAnchor="end"
                                height={70} 
                                interval="preserveStartEnd" 
                                minTickGap={50} 
                            />
                            <YAxis stroke="#4b5563" tick={{ fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip 
                                labelFormatter={(label) => formatTimestamp(label)} 
                                formatter={(value: number, name: string) => {
                                    if (name === 'Temperature') return [value.toFixed(1) + ' °C', name];
                                    if (name === 'Humidity') return [value.toFixed(1) + ' %', name];
                                    if (name === 'Soil Moisture') return [value.toFixed(1) + ' %', name];
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar
                                dataKey="temperature"
                                fill="#ef4444" 
                                name="Temperature (°C)"
                                activeBar={<Rectangle fill="#fca5a5" stroke="#dc2626" />}
                                barSize={20}
                            />
                            <Bar
                                dataKey="humidity"
                                fill="#3b82f6" 
                                name="Humidity (%)"
                                activeBar={<Rectangle fill="#93c5fd" stroke="#2563eb" />}
                                barSize={20}
                            />
                            <Bar
                                dataKey="soilMoisture"
                                fill="#22c55e" 
                                name="Soil Moisture (%)"
                                activeBar={<Rectangle fill="#86efac" stroke="#16a34a" />}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M3 14h18M9 20h6M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"></path></svg>
                        <p className="text-lg">No sensor data available to display.</p>
                        <p className="text-sm">Waiting for new data from sensors or check connection...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
