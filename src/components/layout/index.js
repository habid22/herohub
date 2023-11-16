import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LOGIN } from "../../lib/routes";
import { useAuth } from "../../lib/auth";


export default function Layout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const {user, isLoading} = useAuth();

    

    useEffect(() => {
        if (pathname.startsWith("/protected") && !user) {
            navigate(LOGIN) 
        }
    }, [pathname]);

    if (isLoading) return "Loading...";
    







    return (
   <>
   This is the child: <Outlet />
   
   </>
  )
}
