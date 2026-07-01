import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Divider, 
  IconButton,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from 'api';

const BexSchema = Yup.object().shape({
  numero_bex: Yup.string().required('Requis'),
  type_bex: Yup.string().oneOf(['LOCAL', 'MARITIME', 'AERIEN', 'HORS_BEX']).required('Requis'),
  fournisseur: Yup.string().required('Requis'),
  date_enlevement_prevue: Yup.date().nullable(),
  items: Yup.array().of(
    Yup.object().shape({
      numero_conteneur: Yup.string(),
      designation_produit: Yup.string().required('Requis'),
      quantite: Yup.number().positive().required('Requis'),
      facture_fcfa: Yup.number().min(0).required('Requis')
    })
  ).min(1, 'Au moins un produit est requis')
});

const CreateBex = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h3" mb={3}>Nouveau Dossier BEX</Typography>
      
      <Formik
        initialValues={{
          numero_bex: '',
          type_bex: 'MARITIME',
          fournisseur: '',
          date_enlevement_prevue: '',
          items: [{ numero_conteneur: '', designation_produit: '', quantite: 1, facture_fcfa: 0 }]
        }}
        validationSchema={BexSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const payload = { ...values };
            if (!payload.date_enlevement_prevue) {
              payload.date_enlevement_prevue = null;
            }
            await api.post('/api/transit/bex/', payload);
            navigate('/transit/bex');
          } catch (err) {
            const errorData = err.response?.data || err.data;
            const errorMsg = errorData 
              ? (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData)
              : err.message;
            setStatus({ error: errorMsg });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status }) => (
          <form onSubmit={handleSubmit}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" mb={2}>Informations Générales</Typography>
              {status?.error && <Alert severity="error" sx={{ mb: 2 }}>{status.error}</Alert>}
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Numéro BEX"
                    name="numero_bex"
                    value={values.numero_bex}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.numero_bex && Boolean(errors.numero_bex)}
                    helperText={touched.numero_bex && errors.numero_bex}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Type BEX"
                    name="type_bex"
                    value={values.type_bex}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="LOCAL">Local</MenuItem>
                    <MenuItem value="MARITIME">Maritime</MenuItem>
                    <MenuItem value="AERIEN">Aérien</MenuItem>
                    <MenuItem value="HORS_BEX">Hors BEX</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fournisseur"
                    name="fournisseur"
                    value={values.fournisseur}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fournisseur && Boolean(errors.fournisseur)}
                    helperText={touched.fournisseur && errors.fournisseur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date Enlèvement Prévue"
                    name="date_enlevement_prevue"
                    value={values.date_enlevement_prevue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ p: 3, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Lignes Produits / Conteneurs</Typography>
                {errors.items && typeof errors.items === 'string' && (
                  <Typography color="error" variant="caption">{errors.items}</Typography>
                )}
              </Box>
              
              <FieldArray name="items">
                {({ push, remove }) => (
                  <Box>
                    {values.items.map((item, index) => (
                      <Box key={index} mb={3}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Conteneur"
                              name={`items.${index}.numero_conteneur`}
                              value={item.numero_conteneur}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Désignation"
                              name={`items.${index}.designation_produit`}
                              value={item.designation_produit}
                              onChange={handleChange}
                              error={touched.items?.[index]?.designation_produit && Boolean(errors.items?.[index]?.designation_produit)}
                            />
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Qté"
                              name={`items.${index}.quantite`}
                              value={item.quantite}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Facture FCFA"
                              name={`items.${index}.facture_fcfa`}
                              value={item.facture_fcfa}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <IconButton onClick={() => remove(index)} color="error" disabled={values.items.length === 1}>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                        {index < values.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                      </Box>
                    ))}
                    <Button 
                      startIcon={<AddIcon />} 
                      onClick={() => push({ numero_conteneur: '', designation_produit: '', quantite: 1, facture_fcfa: 0 })}
                    >
                      Ajouter une ligne
                    </Button>
                  </Box>
                )}
              </FieldArray>
            </Card>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/transit/bex')}>Annuler</Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isSubmitting}
              >
                Enregistrer le Dossier
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateBex;
