import { IndexRouteObject, NonIndexRouteObject, Navigate } from 'react-router-dom';
import { ErrorPage } from './comps/ErrorPage';

export interface MenuRouteObject
  extends Omit<IndexRouteObject, 'children' | 'index'>,
    Omit<NonIndexRouteObject, 'children' | 'index'> {
  index?: boolean;
  label?: string;
  children?: MenuRouteObject[];
}

export const routes: MenuRouteObject[] = [
  {
    path: '/',
    lazy: () => import('./comps/Layout'),
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        element: <Navigate to="/passwords" />,
      },
      {
        path: 'passwords',
        label: 'Home',
        lazy: () => import('./pages/home'),
        children: [
          {
            path: ':id',
            lazy: () => import('./pages/home/preview'),
          },
          {
            path: ':id/remove',
            lazy: () => import('./pages/home/remove'),
          },
          {
            path: ':id/edit',
            lazy: () => import('./pages/home/edit'),
          },
        ],
      },
      {
        path: 'add/passwords',
        lazy: () => import('./pages/home/add'),
      },
      {
        path: 'import',
        lazy: () => import('./pages/import/layout'),
        children: [
          {
            path: 'passwords/csv',
            lazy: () => import('./pages/import/csv'),
          },
          {
            path: 'passwords/macpass',
            lazy: () => import('./pages/import/macpass'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    lazy: () => import('./pages/login/login'),
  },
  {
    path: '/signup',

    lazy: () => import('./pages/login/signup'),
  },
];
