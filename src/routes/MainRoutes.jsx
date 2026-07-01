import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage')));

// Laborex Transit Views
const BexList = Loadable(lazy(() => import('views/Transit/Bex/index')));
const CreateBex = Loadable(lazy(() => import('views/Transit/Bex/CreateBex')));
const BexDetails = Loadable(lazy(() => import('views/Transit/Bex/BexDetails')));
const AdiList = Loadable(lazy(() => import('views/Transit/Adi/index')));
const CreateAdi = Loadable(lazy(() => import('views/Transit/Adi/CreateAdi')));
const AdiDetails = Loadable(lazy(() => import('views/Transit/Adi/AdiDetails')));
const CcpqList = Loadable(lazy(() => import('views/Transit/Ccpq/index')));
const CreateCcpq = Loadable(lazy(() => import('views/Transit/Ccpq/CreateCcpq')));
const CcpqDetails = Loadable(lazy(() => import('views/Transit/Ccpq/CcpqDetails')));
const UserList = Loadable(lazy(() => import('views/Admin/Users/index')));
const Settings = Loadable(lazy(() => import('views/Admin/Settings/index')));

const FacturesProformasList = Loadable(lazy(() => import('views/Transit/FacturesProformas/index')));
const CreateFacture = Loadable(lazy(() => import('views/Transit/FacturesProformas/CreateFacture')));
const FactureDetails = Loadable(lazy(() => import('views/Transit/FacturesProformas/FactureDetails')));

const Profile = Loadable(lazy(() => import('views/Profile/index')));

// ==============================|| MAIN ROUTES ||============================== //

import ProtectedRoute from 'component/ProtectedRoute';

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    { path: '/utils/util-typography', element: <UtilsTypography /> },
    { path: '/sample-page', element: <SamplePage /> },
    
    // Transit routes
    { path: '/transit/bex', element: <BexList /> },
    { path: '/transit/bex/create', element: <CreateBex /> },
    { path: '/transit/bex/:id', element: <BexDetails /> },
    { path: '/transit/adi', element: <AdiList /> },
    { path: '/transit/adi/create', element: <CreateAdi /> },
    { path: '/transit/adi/:id', element: <AdiDetails /> },
    { path: '/transit/ccpq', element: <CcpqList /> },
    { path: '/transit/ccpq/create', element: <CreateCcpq /> },
    { path: '/transit/ccpq/:id', element: <CcpqDetails /> },
    
    { path: '/transit/factures-proformas', element: <FacturesProformasList /> },
    { path: '/transit/factures-proformas/create', element: <CreateFacture /> },
    { path: '/transit/factures-proformas/:id', element: <FactureDetails /> },
    
    // User routes
    { path: '/profile', element: <Profile /> },
    
    // Admin routes
    { path: '/admin/users', element: <UserList /> },
    { path: '/admin/settings', element: <Settings /> }
  ]
};

export default MainRoutes;
