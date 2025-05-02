import { useLocation, useNavigate } from "react-router";
import { DashboardRoute, SettingsRoute, SignInRoute } from "../routeConstants.ts";
import clsx from "clsx";

export default function Dock() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "Dashboard", route: DashboardRoute, icon: "🌱" },
        { label: "Settings", route: SettingsRoute, icon: "⚙️" },
        { label: "Sign In", route: SignInRoute, icon: "🔐" },
    ];

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-green-50 border border-green-200 rounded-2xl shadow-lg flex justify-around p-2">
            {navItems.map(({ label, route, icon }) => {
                const isActive = location.pathname === route;
                return (
                    <button
                        key={route}
                        onClick={() => navigate(route)}
                        className={clsx(
                            "flex flex-col items-center text-sm transition-all duration-200 p-2 rounded-xl",
                            isActive
                                ? "text-green-700 bg-green-200 font-semibold"
                                : "text-green-800 hover:bg-green-100"
                        )}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <span className="text-2xl">{icon}</span>
                        <span className="mt-1">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
