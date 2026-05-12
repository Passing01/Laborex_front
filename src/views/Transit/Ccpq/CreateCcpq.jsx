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

const CcpqSchema = Yup.object().shape({
  numero_ccpq: Yup.string().required('Requis'),
  date_depot: Yup.date().nullable()
});

const CreateCcpq = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h3" mb={3}>Nouveau Dossier CCPQ</Typography>
      
      <Formik
        initialValues={{
          numero_ccpq: '',
          date_depot: ''
        }}
        validationSchema={CcpqSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await api.post('/api/transit/ccpq/', values);
            navigate('/transit/ccpq');
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
                    label="Numéro CCPQ"
                    name="numero_ccpq"
                    value={values.numero_ccpq}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.numero_ccpq && Boolean(errors.numero_ccpq)}
                    helperText={touched.numero_ccpq && errors.numero_ccpq}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date de Dépôt"
                    name="date_depot"
                    value={values.date_depot}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Card>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/transit/ccpq')}>Annuler</Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isSubmitting}
              >
                Enregistrer le Dossier CCPQ
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateCcpq;
