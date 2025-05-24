import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { DashboardRoute, SettingsRoute, SignInRoute, TreshHistoryRoute } from "../routeConstants.ts";
import clsx from "clsx";
import { useAtom } from "jotai";
import { JwtAtom, MobileSidebarOpenAtom } from "../atoms.ts"; 
import toast from "react-hot-toast";
import {
    HomeIcon,
    Cog6ToothIcon,
    QueueListIcon,
    ArrowLeftOnRectangleIcon, 
    ArrowRightOnRectangleIcon,
    XMarkIcon 
} from '@heroicons/react/24/outline';

// Define types for navigation items
type NavItemBase = {
    name: string;
    icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;
};

type NavLinkItem = NavItemBase & {
    href: string;
    action?: () => void; 
    isButton?: false | undefined; // Explicitly not a button or undefined
};

type NavButtonItem = NavItemBase & {
    action: () => void;
    isButton: true;
    href?: undefined;    // Explicitly no href for buttons
};

type NavigationItem = NavLinkItem | NavButtonItem;

const baseNavigationItems: NavigationItem[] = [
    { name: "Dashboard", href: DashboardRoute, icon: HomeIcon },
    { name: "Settings", href: SettingsRoute, icon: Cog6ToothIcon },
    { name: "Threshold History", href: TreshHistoryRoute, icon: QueueListIcon },
];

export default function Sidebar() {
    const location = useLocation();
    const [jwt, setJwt] = useAtom(JwtAtom);
    const navigate = useNavigate();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useAtom(MobileSidebarOpenAtom);

    const handleSignOut = () => {
        localStorage.removeItem('jwt');
        setJwt('');
        toast.success("Signed out successfully!");
        navigate(SignInRoute); 
        setIsMobileSidebarOpen(false); 
    };

    const dynamicNavigationItems: NavigationItem[] = jwt && jwt.length > 0
        ? [{ name: "Sign Out", action: handleSignOut, icon: ArrowRightOnRectangleIcon, isButton: true }]
        : [{ name: "Sign In", href: SignInRoute, icon: ArrowLeftOnRectangleIcon, action: () => setIsMobileSidebarOpen(false) }];

    const navigationItems: NavigationItem[] = [
        ...baseNavigationItems,
        ...dynamicNavigationItems
    ];

    const sidebarContent = (
        <>
            <div className="p-4 mb-4 border-b border-green-600 flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/greenhouse-logo.svg" alt="Greenhouse Logo" className="h-8 w-auto mr-2" onError={(e) => (e.currentTarget.style.display = 'none')} /> 
                    <h1 className="text-2xl font-bold text-white">Greenhouse</h1> 
                </div>
                <button 
                    onClick={() => setIsMobileSidebarOpen(false)} 
                    className="md:hidden p-1 text-green-300 hover:text-white"
                    aria-label="Close sidebar"
                >
                    <XMarkIcon className="h-7 w-7" />
                </button>
            </div>
            <nav className="flex-grow px-2 space-y-1">
                {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const commonLinkAction = item.href ? () => setIsMobileSidebarOpen(false) : undefined;

                    if ('isButton' in item && item.isButton) {
                        return (
                            <button
                                key={item.name}
                                onClick={() => { 
                                    item.action(); // action is guaranteed by NavButtonItem type
                                    setIsMobileSidebarOpen(false); 
                                }}
                                className={clsx(
                                    "group flex items-center w-full px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150",
                                    "hover:bg-green-600 hover:text-white text-left"
                                )}
                            >
                                <IconComponent className="h-6 w-6 mr-3 shrink-0" aria-hidden="true" />
                                {item.name}
                            </button>
                        );
                    }
                    return (
                        <NavLink
                            key={item.name}
                            to={item.href} // href is guaranteed by NavLinkItem type (item is narrowed here)
                            onClick={item.action || commonLinkAction} 
                            className={({ isActive }) =>
                                clsx(
                                    "group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150",
                                    isActive
                                        ? "bg-green-800 text-white shadow-inner"
                                        : "hover:bg-green-600 hover:text-white"
                                )
                            }
                        >
                            <IconComponent className="h-6 w-6 mr-3 shrink-0" aria-hidden="true" />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>
            <div className="p-4 mt-auto border-t border-green-600">
                <p className="text-xs text-green-300 text-center">&copy; {new Date().getFullYear()} Greenhouse IOT</p>
            </div>
        </>
    );

    return (
        <>
            <div className={clsx(
                "fixed inset-0 z-40 flex md:hidden",
                isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
                "transition-transform duration-300 ease-in-out"
            )}>
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75" onClick={() => setIsMobileSidebarOpen(false)}></div>
                <div className="relative flex flex-col w-64 bg-green-700 text-green-100 h-screen shadow-lg">
                    {sidebarContent}
                </div>
            </div>

            <div className="hidden md:flex md:flex-col md:w-64 bg-green-700 text-green-100 h-screen shadow-lg">
                {sidebarContent} 
            </div>
        </>
    );
}
