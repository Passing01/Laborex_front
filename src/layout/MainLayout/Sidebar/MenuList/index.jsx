import React from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| MENULIST ||============================== //

import { useAuth } from 'context/AuthContext';

const MenuList = () => {
  const { user } = useAuth();
  
  const navItems = menuItem.items
    .filter((item) => {
      // Masquer l'administration pour les non-admins
      if (item.id === 'admin' && user?.role !== 'ADMIN') {
        return false;
      }
      // Masquer le module transit pour les admins (RSI)
      if (item.id === 'transit' && user?.role === 'ADMIN') {
        return false;
      }
      return true;
    })
    .map((item) => {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });

  return navItems;
};

export default MenuList;
