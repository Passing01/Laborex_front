import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Chip, Grid } from '@mui/material';
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

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transit/adi')} sx={{mb:2}}>Retour</Button>
      <Card sx={{p:3}}>
        <Typography variant="h3" mb={3}>Détails ADI: {adi.numero_adi}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Fournisseur:</strong> {adi.fournisseur || 'N/A'}</Typography>
            <Typography><strong>Pays:</strong> {adi.pays || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography><strong>Statut:</strong></Typography>
              <Chip label={adi.statut_display || adi.statut} color="primary" />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default AdiDetails;
