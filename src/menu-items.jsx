import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

import TransitEnterentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  TransitEnterentOutlinedIcon: TransitEnterentOutlinedIcon,
  ReceiptOutlinedIcon: ReceiptOutlinedIcon,
  GavelOutlinedIcon: GavelOutlinedIcon,
  PeopleOutlinedIcon: PeopleOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //

export default {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Tableau de bord',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        }
      ]
    },
    {
      id: 'transit',
      title: 'Module Transit',
      caption: 'Gestion des dossiers',
      type: 'group',
      children: [
        {
          id: 'bex',
          title: 'Dossiers BEX',
          type: 'item',
          url: '/transit/bex',
          icon: icons['TransitEnterentOutlinedIcon']
        },
        {
          id: 'adi',
          title: 'ADI',
          type: 'item',
          url: '/transit/adi',
          icon: icons['ReceiptOutlinedIcon']
        },
        {
          id: 'ccpq',
          title: 'CCPQ',
          type: 'item',
          url: '/transit/ccpq',
          icon: icons['GavelOutlinedIcon']
        },
        {
          id: 'factures',
          title: 'Factures Proformas',
          type: 'item',
          url: '/transit/factures-proformas',
          icon: icons['ChromeReaderModeOutlinedIcon']
        }
      ]
    },
    {
      id: 'admin',
      title: 'Administration',
      type: 'group',
      children: [
        {
          id: 'users',
          title: 'Utilisateurs',
          type: 'item',
          url: '/admin/users',
          icon: icons['PeopleOutlinedIcon']
        }
        /*
        ,
        {
          id: 'settings',
          title: 'Paramètres',
          type: 'item',
          url: '/admin/settings',
          icon: icons['SecurityOutlinedIcon']
        }
        */
      ]
    }
  ]
};
