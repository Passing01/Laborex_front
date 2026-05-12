import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Stack, 
  Card, 
  Avatar, 
  useTheme,
  AppBar,
  Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeroImage from 'assets/images/landing-hero.png';

// Icons
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Gestion BEX',
      desc: 'Suivi complet des Bordereaux d\'Entrée en X (BEX) avec workflow de validation.',
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main
    },
    {
      title: 'ADI & CCPQ',
      desc: 'Centralisation des Autorisations de Mise sur le Marché et Certificats de Qualité.',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Sécurité RSI',
      desc: 'Contrôle d\'accès granulaire et traçabilité totale des opérations de transit.',
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main
    }
  ];

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid #f0f0f0', bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
              LABOREX <span style={{ color: '#000' }}>TRANSIT</span>
            </Typography>
            <Button variant="contained" onClick={() => navigate('/login')} sx={{ borderRadius: 2 }}>
              Espace Personnel
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        pt: 10, 
        pb: 15, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Typography variant="h1" sx={{ fontWeight: 900, lineHeight: 1.2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                  Optimisez votre <span style={{ color: theme.palette.primary.main }}>Suivi Documentaire</span> de Transit.
                </Typography>
                <Typography variant="h5" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                  La plateforme centralisée pour la gestion des BEX, ADI et CCPQ. 
                  Fiabilité, traçabilité et rapidité pour les équipes Laborex Burkina.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" size="large" onClick={() => navigate('/login')} sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}>
                    Commencer maintenant
                  </Button>
                  <Button variant="outlined" size="large" sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}>
                    En savoir plus
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -20,
                  left: -20,
                  right: 20,
                  bottom: 20,
                  border: `2px solid ${theme.palette.primary.main}`,
                  borderRadius: 4,
                  zIndex: 0
                }
              }}>
                <img 
                  src={HeroImage} 
                  alt="Transit illustration" 
                  style={{ 
                    width: '100%', 
                    borderRadius: '24px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    position: 'relative',
                    zIndex: 1
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: -10, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4, 
                height: '100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-10px)' }
              }}>
                <Avatar sx={{ bgcolor: f.color, width: 70, height: 70, mb: 3 }}>
                  {f.icon}
                </Avatar>
                <Typography variant="h4" mb={2} fontWeight="bold">{f.title}</Typography>
                <Typography variant="body1" color="textSecondary">{f.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats / Callout */}
      <Box sx={{ py: 15, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <TrendingUpIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h2" mb={3} fontWeight="bold">Prêt à transformer votre logistique ?</Typography>
          <Typography variant="h5" color="textSecondary" mb={5}>
            Rejoignez les agents de transit et simplifiez vos opérations quotidiennes dès aujourd'hui.
          </Typography>
          <Button variant="contained" size="large" color="primary" onClick={() => navigate('/login')} sx={{ px: 6, py: 2, borderRadius: 2 }}>
            Se Connecter au Système
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a1a1a', color: '#fff', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="body1">
              © 2026 Laborex Burkina Faso. Tous droits réservés.
            </Typography>
            <Stack direction="row" spacing={4}>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}>Support Technique</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}>RSI Command</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}>Confidentialité</Typography>
            </Stack>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
