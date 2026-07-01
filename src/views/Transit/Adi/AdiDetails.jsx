import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Chip, Grid, Tooltip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from 'api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdiDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adi, setAdi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.get(`/api/transit/adi/${id}/`);
        setAdi(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <Typography>Chargement...</Typography>;
  if (!adi) return <Typography>Non trouvé.</Typography>;

  const renderAlerteBadge = (alerte_retard) => {
    if (!alerte_retard) return null;
    const { statut, jours_restants, deadline } = alerte_retard;
    
    let color, label, icon;
    switch(statut) {
      case 'NORMAL': color = 'success'; label = `Dans les temps (Reste ${jours_restants} j)`; break;
      case 'PROCHE': color = 'warning'; icon = '⚠️'; label = `Échéance proche (${jours_restants} j)`; break;
      case 'DEPASSE': color = 'error'; icon = '🚨'; label = `En retard de ${Math.abs(jours_restants)} j`; break;
      case 'TERMINE': color = 'info'; label = 'Clôturé'; break;
      default: return null;
    }
    
    return (
      <Tooltip title={`Date limite: ${deadline || 'N/A'}`}>
        <Chip 
          icon={icon ? <span>{icon}</span> : undefined} 
          label={label} 
          color={color} 
          variant={statut === 'DEPASSE' ? 'filled' : 'outlined'}
          sx={statut === 'NORMAL' ? { color: '#10B981', borderColor: '#10B981', ml: 1 } : { ml: 1 }}
        />
      </Tooltip>
    );
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transit/adi')} sx={{mb:2}}>Retour</Button>
      <Card sx={{p:3}}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h3">Détails ADI: {adi.numero_adi}</Typography>
            {renderAlerteBadge(adi.alerte_retard)}
          </Box>
          <Chip label={adi.statut_display || adi.statut} color="primary" />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" gutterBottom>Informations Générales</Typography>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">Fournisseur</Typography>
              <Typography variant="body1">{adi.fournisseur || 'N/A'}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">Pays</Typography>
              <Typography variant="body1">{adi.pays || 'N/A'}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">Organisme Émetteur</Typography>
              <Typography variant="body1">{adi.organisme_emetteur || 'N/A'}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">Factures</Typography>
              <Typography variant="body1">{adi.factures || 'N/A'}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" gutterBottom>Données Quantitatives</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">Items</Typography>
                <Typography variant="body1">{adi.nb_items ?? '0'}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">Quantité</Typography>
                <Typography variant="body1">{adi.quantite ?? '0'}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">ASI</Typography>
                <Typography variant="body1">{adi.asi ?? '0'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">Coût Total</Typography>
                <Typography variant="h4" color="secondary">
                  {adi.cout ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(adi.cout) : '0 FCFA'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" gutterBottom>Dates</Typography>
            <Box display="flex" gap={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">Date Dépôt</Typography>
                <Typography variant="body1">{adi.date_depot || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Date Réception</Typography>
                <Typography variant="body1">{adi.date_reception || 'N/A'}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>Observations</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {adi.observations || 'Aucune observation.'}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default AdiDetails;
