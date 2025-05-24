import toast from "react-hot-toast";
import {useEffect, useState, } from "react";
import {useAtom} from "jotai";
import {JwtAtom} from "../atoms.ts";
import {thresholdsClient} from "../apiControllerClients.ts";
import { useNavigate } from "react-router-dom";
import { FullPageSpinner } from "./Spinner.tsx"; 

export default function Settings() {
    const [jwt] = useAtom(JwtAtom);
    const [tempHigh, setTempHigh] = useState(28.0);
    const [tempLow, setTempLow] = useState(24.0);
    const [humidityHigh, setHumidityHigh] = useState(85.0);
    const [humidityLow, setHumidityLow] = useState(60.0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!jwt) return;
        setLoading(true);
        thresholdsClient.get()
            .then(data => {
                setTempHigh(data.tempHigh ?? 28.0);
                setTempLow(data.tempLow ?? 24.0);
                setHumidityHigh(data.humidityHigh ?? 85.0);
                setHumidityLow(data.humidityLow ?? 60.0);
            })
            .catch(() => {
                toast.error("Failed to load current thresholds");
            })
            .finally(() => setLoading(false));
    }, [jwt]);

    if (!jwt || jwt.length < 1) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-700 text-xl">
                ⚙️ Please sign in to access settings.
            </div>
        )
    }

    if (loading) {
        return <FullPageSpinner message="Loading current settings..." />;
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            await thresholdsClient.update({
                tempHigh,
                tempLow,
                humidityHigh,
                humidityLow
            });
            toast.success("✅ Thresholds updated successfully!");
        } catch (err: any) {
            toast.error("❌ Failed to update thresholds. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Root div adapts to AppLayout, AppLayout provides bg-green-50 and padding.
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-green-700">⚙️ Greenhouse Settings</h1>
                <button
                    onClick={() => navigate('/tresholdhistory')}
                    className="bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-150 flex items-center"
                >
                    <span className="mr-2">📜</span> See Threshold History
                </button>
            </div>

            {/* Settings Card - wider and consistent styling */}
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-2xl mx-auto">
                <div className="text-center mb-6 md:mb-8">
                    {/* Optional: Icon or image if desired, but keep it subtle */}
                    {/* <img src="https://cdn-icons-png.flaticon.com/512/2909/2909769.png" alt="Greenhouse Icon" className="w-16 mx-auto mb-3"/> */}
                    <h2 className="text-2xl font-semibold text-green-600">
                        Adjust Threshold Values
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Set the desired temperature and humidity ranges.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="tempHigh" className="block text-sm font-medium text-gray-700 mb-1">Temperature High (°C)</label>
                            <input
                                id="tempHigh"
                                type="number"
                                step="0.1" // Allow decimal input
                                value={tempHigh}
                                onChange={e => setTempHigh(parseFloat(e.target.value))}
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors duration-150"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="tempLow" className="block text-sm font-medium text-gray-700 mb-1">Temperature Low (°C)</label>
                            <input
                                id="tempLow"
                                type="number"
                                step="0.1"
                                value={tempLow}
                                onChange={e => setTempLow(parseFloat(e.target.value))}
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors duration-150"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="humidityHigh" className="block text-sm font-medium text-gray-700 mb-1">Humidity High (%)</label>
                            <input
                                id="humidityHigh"
                                type="number"
                                step="0.1"
                                value={humidityHigh}
                                onChange={e => setHumidityHigh(parseFloat(e.target.value))}
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors duration-150"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="humidityLow" className="block text-sm font-medium text-gray-700 mb-1">Humidity Low (%)</label>
                            <input
                                id="humidityLow"
                                type="number"
                                step="0.1"
                                value={humidityLow}
                                onChange={e => setHumidityLow(parseFloat(e.target.value))}
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors duration-150"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="pt-4 text-center">
                        <button 
                            type="submit"
                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "🌿 Save Thresholds"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}