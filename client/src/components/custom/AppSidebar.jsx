import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/button";
import { Calendar, ChartBar, ChartBarStacked, FilePlus2Icon, GalleryVerticalEnd, Home, Inbox, PackageSearch, Search, Settings, ShoppingCart, UserCheck } from "lucide-react";
import { logout } from "../../redux/slices/auth/authSlice";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

const items = [
    { title: "Products", url: "/admin/dashboard", icon: FilePlus2Icon },
    { title: "Create Category", url: "/admin/category", icon: ChartBarStacked },
    { title: "All Products", url: "/admin/dashboard/all-products", icon: GalleryVerticalEnd },
    { title: "Orders", url: "/admin/dashboard/orders", icon: PackageSearch },
    { title: "Analytics", url: "/admin/dashboard/analytics", icon: ChartBar },
    { title: "Users", url: "/admin/dashboard/users", icon: UserCheck },
    { title: "Shop", url: "/", icon: ShoppingCart },
 
];

export function AppSidebar() {
    const { user } = useSelector((state) => state.auth);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const handleLogout = () => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((response) => {
                window.localStorage.removeItem('user');
                dispatch(logout());
                navigate('/login');
            })
            .catch((error) => {
                console.error('Logout error:', error);
                window.localStorage.removeItem('user');
                setMessage('An error occurred while logging out.');
            });
    };



    if (message) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-center">
                    <p>{message}</p>
                </div>
            </div>
        );
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <h3>Dashboard</h3>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map((item) => {
                            const isActive = pathname === item.url;
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className={isActive ? 'bg-zinc-200' : ''}>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <Button onClick={handleLogout}>Logout</Button>
            </SidebarFooter>
        </Sidebar>
    );
}
