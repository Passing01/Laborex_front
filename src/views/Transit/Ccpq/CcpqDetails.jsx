import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Divider, Typography, Button, Chip, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from 'api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DetailItem = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: value ? 500 : 400, color: value ? 'text.primary' : 'text.disabled' }}>
      {value || '—'}
    </Typography>
  </Box>
);

const CcpqDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ccpq, setCcpq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.get(`/api/transit/ccpq/${id}/`);
        setCcpq(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <Typography>Chargement...</Typography>;
  if (!ccpq) return <Typography>Dossier CCPQ introuvable.</Typography>;

  const formatMontant = (val, devise) =>
    val != null ? `${parseFloat(val).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${devise}` : null;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transit/ccpq')} sx={{ mb: 2 }}>
        Retour à la liste
      </Button>

      <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)' }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
              <Typography variant="h3" fontWeight={700}>Dossier CCPQ : {ccpq.numero_ccpq}</Typography>
              <Chip
                label={ccpq.statut_display || ccpq.statut}
                color={ccpq.statut === 'APPROUVE' ? 'success' : ccpq.statut === 'REJETE' ? 'error' : 'primary'}
                sx={{ fontWeight: 600, borderRadius: '8px' }}
              />
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>

            {/* Informations Principales */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
                Informations Générales
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Numéro CCPQ" value={ccpq.numero_ccpq} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Date de Dépôt" value={ccpq.date_depot} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Date de Résultat" value={ccpq.date_resultat} />
            </Grid>

            {/* Numéro SYLVIE */}
            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="Numéro SYLVIE CCPQ+CAF" value={ccpq.numero_sylvie} />
            </Grid>

            {/* Montants FOB */}
            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="FOB (EURO)" value={formatMontant(ccpq.fob_euro, '€')} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailItem label="FOB (FCFA)" value={formatMontant(ccpq.fob_fcfa, 'FCFA')} />
            </Grid>

            {/* Résultat et motif */}
            {ccpq.resultat && (
              <Grid item xs={12} sm={6} md={4}>
                <DetailItem label="Résultat" value={ccpq.resultat} />
              </Grid>
            )}
            {ccpq.motif_rejet && (
              <Grid item xs={12}>
                <DetailItem label="Motif de Rejet" value={ccpq.motif_rejet} />
              </Grid>
            )}

            {/* BEX lié */}
            {ccpq.bex && (
              <>
                <Grid item xs={12}>
                  <Divider />
                  <Typography variant="subtitle1" fontWeight={700} color="primary" mt={2} gutterBottom>
                    Dossier BEX Associé
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DetailItem label="ID BEX lié" value={`#${ccpq.bex}`} />
                </Grid>
              </>
            )}

          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CcpqDetails;

