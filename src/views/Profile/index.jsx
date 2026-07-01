import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import api from 'api';
import Swal from 'sweetalert2';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/api/users/me/');
        setUserInfo(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          password: ''
        });
      } catch (err) {
        console.error('Erreur lors du chargement du profil', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger votre profil.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Préparer le payload
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }
      
      const response = await api.put('/api/users/me/', payload);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: response.message || 'Profil mis à jour avec succès.',
        timer: 3000
      });
      
      // Réinitialiser le mot de passe dans le formulaire
      setFormData(prev => ({ ...prev, password: '' }));
      
    } catch (err) {
      console.error('Erreur de mise à jour', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.data?.detail || err.message || 'Une erreur est survenue lors de la mise à jour.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" mb={3}>Mon Profil</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Box 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '2rem',
                  mb: 2
                }}
              >
                {formData.first_name?.[0]?.toUpperCase() || userInfo?.username?.[0]?.toUpperCase()}
              </Box>
              <Typography variant="h4">{formData.first_name} {formData.last_name}</Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>@{userInfo?.username}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  bgcolor: '#e3f2fd', 
                  color: '#1976d2', 
                  px: 2, 
                  py: 0.5, 
                  borderRadius: 1 
                }}
              >
                {userInfo?.role_display || userInfo?.role}
              </Typography>
            </Box>
            
            <Box mt={4}>
              <Typography variant="subtitle2" color="textSecondary">Informations de connexion</Typography>
              <Box mt={2}>
                <Typography variant="caption" color="textSecondary" display="block">Dernière connexion</Typography>
                <Typography variant="body2">{userInfo?.last_login ? new Date(userInfo.last_login).toLocaleString() : 'N/A'}</Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="caption" color="textSecondary" display="block">Date de création</Typography>
                <Typography variant="body2">{userInfo?.date_joined ? new Date(userInfo.date_joined).toLocaleDateString() : 'N/A'}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" mb={3}>Modifier mes informations</Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Adresse Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Laissez le champ mot de passe vide si vous ne souhaitez pas le modifier.
                  </Alert>
                  <TextField
                    fullWidth
                    type="password"
                    label="Nouveau Mot de passe"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Entrez un nouveau mot de passe..."
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={saving}
                    size="large"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
