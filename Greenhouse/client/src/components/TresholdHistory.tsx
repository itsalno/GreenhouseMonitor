import {thresholdsClient} from "../apiControllerClients.ts";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {useAtom} from "jotai/index";
import {JwtAtom, TresholdsAtom} from "../atoms.ts";
import {FullPageSpinner} from "./Spinner.tsx";

export default function TresholdHistory() { 
    const [jwt] = useAtom(JwtAtom);
    const [thresholdsHistory, setThresholdsHistory] = useAtom(TresholdsAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!jwt) return;

        setLoading(true);
        thresholdsClient.getAll()
            .then(data => {
                setThresholdsHistory(data); 
            })
            .catch(() => {
                toast.error("Failed to load thresholds");
            })
            .finally(() => setLoading(false));
    }, [jwt]);

    if (!jwt || jwt.length < 1) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-700 text-xl">Please sign in to continue</p>
            </div>
        );
    }

    if (loading) {
        return <FullPageSpinner message="Loading history..." />;
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-8 text-green-700">🌱 Threshold History</h1>

            <div className="space-y-6 max-w-none">
                {thresholdsHistory.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">No threshold records found.</p>
                    </div>
                ) : (
                    thresholdsHistory.map((t, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 ease-in-out border border-green-200 hover:scale-[1.02]"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold text-green-700">
                                    Threshold Record
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><strong className="text-green-600">🌡️ Temp High:</strong> {t.tempHigh}°C</p>
                                <p><strong className="text-green-600">🌡️ Temp Low:</strong> {t.tempLow}°C</p>
                                <p><strong className="text-green-600">💧 Humidity High:</strong> {t.humidityHigh}%</p>
                                <p><strong className="text-green-600">💧 Humidity Low:</strong> {t.humidityLow}%</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}