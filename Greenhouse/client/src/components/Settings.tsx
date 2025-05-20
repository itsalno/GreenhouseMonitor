import toast from "react-hot-toast";
import {useEffect, useState, } from "react";
import {useAtom} from "jotai";
import {JwtAtom} from "../atoms.ts";
import {thresholdsClient} from "../apiControllerClients.ts";
import { useNavigate } from "react-router-dom";


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
                toast.error("Failed to load thresholds");
            })
            .finally(() => setLoading(false));
    }, [jwt]);

    if (!jwt || jwt.length < 1) {
        return (<div className="flex flex-col items-center justify-center h-screen bg-green-100">please sign in to continue</div>)
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
            toast.success("Thresholds updated!");
        } catch (err: any) {
            toast.error("Failed to update thresholds");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-green-300">
            {/* Top-left History Button */}
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => navigate('/tresholdhistory')}
                    className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                >
                    📜 See Threshold History
                </button>
            </div>
            <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 flex flex-col items-center w-[350px] border-4 border-green-400">
                <img src="https://cdn-icons-png.flaticon.com/512/2909/2909769.png" alt="Greenhouse" className="w-20 mb-4 drop-shadow-lg"/>
                <h2 className="text-3xl font-bold mb-4 text-green-800 flex items-center gap-2">
                    <span>🌱</span> Greenhouse Thresholds
                </h2>
                <div className="flex flex-col gap-5 w-full">
                    <label className="flex flex-col text-green-900 font-semibold">
                        Temperature High (°C)
                        <input
                            type="number"
                            value={tempHigh}
                            onChange={e => setTempHigh(parseFloat(e.target.value))}
                            className="input input-bordered mt-1 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-green-200"
                            disabled={loading}
                        />
                    </label>
                    <label className="flex flex-col text-green-900 font-semibold">
                        Temperature Low (°C)
                        <input
                            type="number"
                            value={tempLow}
                            onChange={e => setTempLow(parseFloat(e.target.value))}
                            className="input input-bordered mt-1 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-green-200"
                            disabled={loading}
                        />
                    </label>
                    <label className="flex flex-col text-green-900 font-semibold">
                        Humidity High (%)
                        <input
                            type="number"
                            value={humidityHigh}
                            onChange={e => setHumidityHigh(parseFloat(e.target.value))}
                            className="input input-bordered mt-1 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-green-200"
                            disabled={loading}
                        />
                    </label>
                    <label className="flex flex-col text-green-900 font-semibold">
                        Humidity Low (%)
                        <input
                            type="number"
                            value={humidityLow}
                            onChange={e => setHumidityLow(parseFloat(e.target.value))}
                            className="input input-bordered mt-1 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-green-200"
                            disabled={loading}
                        />
                    </label>
                </div>
                <div className="flex justify-center w-full mt-2">
                    <button className="btn btn-success text-lg font-bold shadow-green-200 shadow-md hover:scale-105 transition-transform px-8 py-3" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "🌿 Save thresholds"}
                    </button>
                </div>
            </div>
        </div>
    );
}