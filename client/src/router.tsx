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
        lazy: () => import('./pages/home'),
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
