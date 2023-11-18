import { createBrowserRouter } from "react-router-dom";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Layout from "../components/layout";
import Content from "../components/navbar/content";






export const ROOT = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";


export const PROTECTED = "/protected";
export const DASHBOARD = "/protected/dashboard";


export const router = createBrowserRouter([
    { path: ROOT, element: <Content /> },
    { path: LOGIN, element: <Login /> },
    { path: REGISTER, element: <Register /> },
    {path: PROTECTED, element: <Layout/>, children: [
        { 
            path: DASHBOARD, 
            element: "Dashboard", },
    ]},
]);


