import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  CircularProgress,
  Alert
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from 'api';
import SaveIcon from '@mui/icons-material/Save';

const AdiSchema = Yup.object().shape({
  numero_adi: Yup.string().required('Requis'),
  factures: Yup.string().nullable(),
  nb_items: Yup.number().integer().min(0).nullable(),
  quantite: Yup.number().integer().min(0).nullable(),
  asi: Yup.number().integer().min(0).nullable(),
  cout: Yup.number().min(0).nullable(),
  date_depot: Yup.date().nullable(),
  date_reception: Yup.date().nullable(),
  fournisseur: Yup.string().nullable(),
  pays: Yup.string().nullable(),
  organisme_emetteur: Yup.string().nullable(),
  observations: Yup.string().nullable(),
});

const CreateAdi = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h3" mb={3}>Nouveau Dossier ADI</Typography>
      
      <Formik
        initialValues={{
          numero_adi: '',
          factures: '',
          nb_items: '',
          quantite: '',
          asi: '',
          cout: '',
          date_depot: '',
          date_reception: '',
          statut: 'EN_ATTENTE',
          fournisseur: '',
          pays: '',
          organisme_emetteur: '',
          observations: ''
        }}
        validationSchema={AdiSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            // Clean values: convert empty strings to null or appropriate types if needed
            const cleanedValues = { ...values };
            ['nb_items', 'quantite', 'asi', 'cout'].forEach(field => {
              if (cleanedValues[field] === '') cleanedValues[field] = null;
            });
            
            await api.post('/api/transit/adi/', cleanedValues);
            navigate('/transit/adi');
          } catch (err) {
            setStatus({ error: err.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status }) => (
          <form onSubmit={handleSubmit}>
            <Card sx={{ p: 3, mb: 3 }}>
              {status?.error && <Alert severity="error" sx={{ mb: 2 }}>{status.error}</Alert>}
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Numéro ADI"
                    name="numero_adi"
                    value={values.numero_adi}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.numero_adi && Boolean(errors.numero_adi)}
                    helperText={touched.numero_adi && errors.numero_adi}
                    placeholder="ADI-2024-001"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Factures (séparées par virgule)"
                    name="factures"
                    value={values.factures}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="1701039, 1701040"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nombre d'items"
                    name="nb_items"
                    value={values.nb_items}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.nb_items && Boolean(errors.nb_items)}
                    helperText={touched.nb_items && errors.nb_items}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantité totale"
                    name="quantite"
                    value={values.quantite}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.quantite && Boolean(errors.quantite)}
                    helperText={touched.quantite && errors.quantite}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Valeur ASI"
                    name="asi"
                    value={values.asi}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.asi && Boolean(errors.asi)}
                    helperText={touched.asi && errors.asi}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Coût total"
                    name="cout"
                    value={values.cout}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputProps={{ step: "0.01" }}
                    error={touched.cout && Boolean(errors.cout)}
                    helperText={touched.cout && errors.cout}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date Dépôt"
                    name="date_depot"
                    value={values.date_depot}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date Réception"
                    name="date_reception"
                    value={values.date_reception}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Fournisseur"
                    name="fournisseur"
                    value={values.fournisseur}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Pays"
                    name="pays"
                    value={values.pays}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Organisme émetteur"
                    name="organisme_emetteur"
                    value={values.organisme_emetteur}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Observations"
                    name="observations"
                    value={values.observations}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
              </Grid>
            </Card>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/transit/adi')}>Annuler</Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isSubmitting}
              >
                Enregistrer le Dossier ADI
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateAdi;
