import {thresholdsClient} from "../apiControllerClients.ts";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {useAtom} from "jotai/index";
import {JwtAtom, TresholdsAtom} from "../atoms.ts";

export default function AdminDashboard() {
    const [jwt] = useAtom(JwtAtom);
    const [thresholdsHistory, setThresholdsHistory] = useAtom(TresholdsAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!jwt) return;

        setLoading(true);
        thresholdsClient.getAll()
            .then(data => {
                setThresholdsHistory(data); // Save to atom
            })
            .catch(() => {
                toast.error("Failed to load thresholds");
            })
            .finally(() => setLoading(false));
    }, [jwt]);

    if (!jwt || jwt.length < 1) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-green-100">
                Please sign in to continue
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <h1 className="text-2xl font-bold mb-6 text-green-800">🌱 Threshold History</h1>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : (
                <div className="space-y-4">
                    {thresholdsHistory.length === 0 ? (
                        <p className="text-gray-600">No threshold records found.</p>
                    ) : (
                        thresholdsHistory.map((t, index) => (
                            <div
                                key={index}
                                className="border-l-4 border-green-400 bg-white rounded-lg shadow-md p-4"
                            >
                                <p><strong>🌡️ Temp High:</strong> {t.tempHigh}°C</p>
                                <p><strong>🌡️ Temp Low:</strong> {t.tempLow}°C</p>
                                <p><strong>💧 Humidity High:</strong> {t.humidityHigh}%</p>
                                <p><strong>💧 Humidity Low:</strong> {t.humidityLow}%</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}