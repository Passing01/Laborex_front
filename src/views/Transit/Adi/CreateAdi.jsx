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
  fournisseur: Yup.string().nullable(),
  pays: Yup.string().nullable()
});

const CreateAdi = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h3" mb={3}>Nouveau Dossier ADI</Typography>
      
      <Formik
        initialValues={{
          numero_adi: '',
          fournisseur: '',
          pays: ''
        }}
        validationSchema={AdiSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await api.post('/api/transit/adi/', values);
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Numéro ADI"
                    name="numero_adi"
                    value={values.numero_adi}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.numero_adi && Boolean(errors.numero_adi)}
                    helperText={touched.numero_adi && errors.numero_adi}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fournisseur"
                    name="fournisseur"
                    value={values.fournisseur}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pays"
                    name="pays"
                    value={values.pays}
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
