import toast from "react-hot-toast";
import {useState} from "react";
import {useAtom} from "jotai";
import {JwtAtom} from "../atoms.ts";

export default function Settings() {
    const [jwt] = useAtom(JwtAtom);

    // ESP32 default thresholds
    const [tempHigh, setTempHigh] = useState(28.0);
    const [tempLow, setTempLow] = useState(24.0);
    const [humidityHigh, setHumidityHigh] = useState(85.0);
    const [humidityLow, setHumidityLow] = useState(60.0);

    if (!jwt || jwt.length < 1) {
        return (<div className="flex flex-col items-center justify-center h-screen bg-green-100">please sign in to continue</div>)
    }

    const handleSave = () => {
        // TODO: Wire up to backend if needed
        toast.success("Thresholds saved (not yet sent to backend)");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-green-300">
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
                        />
                    </label>
                    <label className="flex flex-col text-green-900 font-semibold">
                        Temperature Low (°C)
                        <input
                            type="number"
                            value={tempLow}
                            onChange={e => setTempLow(parseFloat(e.target.value))}
                            className="input input-bordered mt-1 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-green-200"
                        />
                    </label>
                    <label className="flex flex-col text-green-900 font-semibold">
                        Humidity High (%)
                        <input
                            type="number"
                            value={humidityHigh}
                            onChange={e => setHumidityHigh(parseFloat(e.target.value))}
                            className="input input-bordered mt-1 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-green-200"
                        />
                    </label>
                    <label className="flex flex-col text-green-900 font-semibold">
                        Humidity Low (%)
                        <input
                            type="number"
                            value={humidityLow}
                            onChange={e => setHumidityLow(parseFloat(e.target.value))}
                            className="input input-bordered mt-1 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-green-200"
                        />
                    </label>
                </div>
                <button className="btn btn-success mt-6 w-full text-lg font-bold shadow-green-200 shadow-md hover:scale-105 transition-transform" onClick={handleSave}>
                    🌿 Save thresholds
                </button>
            </div>
        </div>
    );
}