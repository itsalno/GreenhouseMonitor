import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminDashboard from "./Dashboard.tsx";
import TresholdHistory from "./TresholdHistory";
import useInitializeData from "../hooks/useInitializeData.tsx";
import { DashboardRoute, SettingsRoute, SignInRoute, TreshHistoryRoute } from '../routeConstants.ts';
import useSubscribeToTopics from "../hooks/useSubscribeToTopics.tsx";
import Settings from "./Settings.tsx";
import Sidebar from "./Sidebar.tsx"; 
import SignIn from "./SignIn.tsx";
import { useAtom } from "jotai";
import { JwtAtom, MobileSidebarOpenAtom } from "../atoms.ts";
import { Bars3Icon } from '@heroicons/react/24/outline'; // Import hamburger icon
import { useEffect } from "react";
import toast from "react-hot-toast";
import WebsocketConnectionIndicator from "./WebsocketConnectionIndicator.tsx";

const AppLayout = () => {
    const [jwt] = useAtom(JwtAtom);
    const [, setIsMobileSidebarOpen] = useAtom(MobileSidebarOpenAtom);
    const location = useLocation();

    useEffect(() => {
        // Close mobile sidebar on route change
        setIsMobileSidebarOpen(false);
    }, [location, setIsMobileSidebarOpen]);

    if (!jwt || jwt.length < 1) {
        return <Outlet />; 
    }

    return (
        <div className="flex h-screen bg-green-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header with Hamburger Menu */}
                <header className="md:hidden bg-green-700 text-white shadow-md sticky top-0 z-30">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <button 
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="p-2 rounded-md text-green-200 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-label="Open sidebar"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-semibold">Greenhouse</h1> {/* Or current page title */}
                        <div className="w-8"></div> {/* Spacer to balance the hamburger icon */}
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-green-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default function ApplicationRoutes() {
    
    const navigate = useNavigate();
    const [jwt] = useAtom(JwtAtom);
    const location = useLocation();
    useInitializeData();
    useSubscribeToTopics(); 

    useEffect(() => {
        if (jwt === undefined || jwt.length < 1) { 
            if (window.location.pathname !== SignInRoute) {
                navigate(SignInRoute);
                toast("Please sign in to continue");
            }
        }
    }, [jwt, navigate]) 
    
    
    useEffect(() => {
        if (jwt && jwt.length > 0 && location.pathname === SignInRoute) {
            toast.success("Already signed in! Redirecting...");
        }
    }, [jwt, location.pathname]);

    return (<>
        <WebsocketConnectionIndicator />
        <Routes>
            <Route element={<AppLayout />}> 
                <Route element={<AdminDashboard/>} path={DashboardRoute}/>
                <Route element={<Settings/>} path={SettingsRoute}/>
                <Route element={<TresholdHistory/>} path={TreshHistoryRoute}/>
            </Route>
            <Route element={<SignIn/>} path={SignInRoute}/>
        </Routes>
    </>)
}