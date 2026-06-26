import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';
import api from 'api';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FactureDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    reference: '',
    nombre_item: '',
    quantite_produits: '',
    items_asi: '',
    items_adi: '',
    cout_facture: ''
  });

  useEffect(() => {
    const fetchFacture = async () => {
      try {
        const data = await api.get(`/api/transit/factures-proformas/${id}/`);
        setFormData({
          reference: data.reference,
          nombre_item: data.nombre_item,
          quantite_produits: data.quantite_produits,
          items_asi: data.items_asi,
          items_adi: data.items_adi,
          cout_facture: data.cout_facture
        });
      } catch (err) {
        Swal.fire('Erreur', 'Impossible de charger la facture.', 'error');
        navigate('/transit/factures-proformas');
      } finally {
        setLoading(false);
      }
    };
    fetchFacture();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      reference: formData.reference,
      nombre_item: parseInt(formData.nombre_item, 10),
      quantite_produits: parseInt(formData.quantite_produits, 10),
      items_asi: parseInt(formData.items_asi, 10) || 0,
      items_adi: parseInt(formData.items_adi, 10) || 0,
      cout_facture: parseFloat(formData.cout_facture)
    };

    try {
      await api.put(`/api/transit/factures-proformas/${id}/`, payload);
      await Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'La facture a été mise à jour.',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/transit/factures-proformas');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.data?.detail || err.message || 'Erreur lors de la mise à jour.'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Retour
        </Button>
        <Typography variant="h3">Modifier la Facture Proforma</Typography>
      </Box>

      <Card>
        <Box p={3} component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Référence"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Nombre d'items"
                name="nombre_item"
                value={formData.nombre_item}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Quantité de produits"
                name="quantite_produits"
                value={formData.quantite_produits}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Coût de la facture"
                name="cout_facture"
                inputProps={{ step: "0.01" }}
                value={formData.cout_facture}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Items ASI"
                name="items_asi"
                value={formData.items_asi}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Items ADI"
                name="items_adi"
                value={formData.items_adi}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Annuler
                </Button>
                <Button variant="contained" type="submit" color="primary">
                  Mettre à jour
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default FactureDetails;
