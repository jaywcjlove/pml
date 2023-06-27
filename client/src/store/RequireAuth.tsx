import { PropsWithChildren } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './';

interface RequireAuthProps {
  children: JSX.Element;
}

export const RequireAuth: React.FC<PropsWithChildren<RequireAuthProps>> = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
};
