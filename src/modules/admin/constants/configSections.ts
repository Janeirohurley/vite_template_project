import { Bell, Palette, Settings, Shield } from "lucide-react";

export const configSections = [
    {
        key: "general",
        path: "/admin/configs/general",
        label: "Paramètres Généraux",
        icon: Settings,
    },
    {
        key: "security",
        path: "/admin/configs/security",
        label: "Sécurité",
        icon: Shield,
    },
    {
        key: "notifications",
        path: "/admin/configs/notifications",
        label: "Notifications",
        icon: Bell,
    },
    {
        key: "interface",
        path: "/admin/configs/interface",
        label: "Interface & Thème",
        icon: Palette,
    },
   
];
