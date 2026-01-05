import { useLocation } from "react-router-dom";
import { FooterSection } from "../../../pages/public/sections";

export default function ConditionalFooter() {
    const location = useLocation();
    const pathname = location.pathname;

    // Hide footer on auth pages like login/register
    const hideFooter =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/debug-auth";

    if (hideFooter) {
        return null;
    }

    return <FooterSection />;
}
