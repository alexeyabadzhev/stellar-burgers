import { ReactNode, FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';

interface ProtectedRouteProps {
  unauthorized?: boolean;
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  unauthorized,
  children
}) => {
  const location = useLocation();
  const isAuthorized = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  if (!isAuthorized) {
    return <Preloader />;
  }

  if (unauthorized && user) {
    const from = (location.state as { from?: { pathname: string } })?.from
      ?.pathname;
    return <Navigate to={from || '/'} replace />;
  }

  if (!unauthorized && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
