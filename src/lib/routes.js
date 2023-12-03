import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Layout from '../components/layout';
import Content from '../components/client/content';
import { useAuth } from '../../src/hooks/auth'; // Update the path accordingly

export const ROOT = '/';
export const LOGIN = '/login';
export const REGISTER = '/register';

export const PROTECTED = '/protected';
export const DASHBOARD = '/protected/dashboard';

export const router = createBrowserRouter([
  { path: ROOT, element: <Content /> },
  { path: LOGIN, element: <Login /> },
  { path: REGISTER, element: <Register /> },
  {
    path: PROTECTED,
    element: <ProtectedRoute />,
    children: [
      {
        path: DASHBOARD,
        element: 'Dashboard',
      },
      // Add more protected routes as needed
    ],
  },
]);

function ProtectedRoute() {
  const { isValidToken } = useAuth();
  console.log("Invalid token")

  return isValidToken ? <Layout /> : <Navigate to={LOGIN} />;

}
