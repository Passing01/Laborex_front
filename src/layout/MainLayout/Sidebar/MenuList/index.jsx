import React, { useState, useEffect } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import api from 'api';

// ==============================|| MENULIST ||============================== //

import { useAuth } from 'context/AuthContext';

const MenuList = () => {
  const { user } = useAuth();
  
  const [bexAlertCount, setBexAlertCount] = useState(0);
  const [adiAlertCount, setAdiAlertCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchAlerts = async () => {
        try {
          const [bexData, adiData] = await Promise.all([
            api.get('/api/transit/bex/'),
            api.get('/api/transit/adi/')
          ]);
          
          const bexCount = bexData.filter(b => b.alerte_retard?.statut === 'DEPASSE' || b.alerte_retard?.statut === 'PROCHE').length;
          const adiCount = adiData.filter(a => a.alerte_retard?.statut === 'DEPASSE' || a.alerte_retard?.statut === 'PROCHE').length;
          
          setBexAlertCount(bexCount);
          setAdiAlertCount(adiCount);
        } catch (error) {
          console.error("Failed to fetch alerts count", error);
        }
      };
      fetchAlerts();
    }
  }, [user]);

  const navItems = menuItem.items
    .filter((item) => {
      // Masquer l'administration pour les non-admins
      if (item.id === 'admin' && user?.role !== 'ADMIN') {
        return false;
      }
      return true;
    })
    .map((item) => {
      const newItem = { ...item };
      
      if (newItem.id === 'transit' && newItem.children) {
        newItem.children = newItem.children.map(child => {
          const newChild = { ...child };
          if (newChild.id === 'bex' && bexAlertCount > 0) {
            newChild.chip = {
              color: 'error',
              variant: 'filled',
              size: 'small',
              label: `${bexAlertCount}`
            };
          } else if (newChild.id === 'adi' && adiAlertCount > 0) {
            newChild.chip = {
              color: 'error',
              variant: 'filled',
              size: 'small',
              label: `${adiAlertCount}`
            };
          } else {
             delete newChild.chip;
          }
          return newChild;
        });
      }

      switch (newItem.type) {
        case 'group':
          return <NavGroup key={newItem.id} item={newItem} />;
        default:
          return (
            <Typography key={newItem.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });

  return navItems;
};

export default MenuList;
