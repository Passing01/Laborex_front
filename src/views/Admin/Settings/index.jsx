import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import api from 'api';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({}); // Tracking which ID is saving

  const fetchSettings = async () => {
    try {
      const data = await api.get('/api/settings/');
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, newValue) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      await api.patch(`/api/settings/${id}/`, { value: newValue });
      fetchSettings();
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleValueChange = (id, newValue) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) return <Box p={3}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h3" mb={3}>Configuration du Système</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Ces paramètres influencent le comportement global de l'application (alertes emails, délais, etc.).
      </Alert>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Clé de Configuration</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Valeur Actuelle</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell><strong>{s.key}</strong></TableCell>
                  <TableCell>{s.description || 'Paramètre système'}</TableCell>
                  <TableCell sx={{ minWidth: 300 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={s.value}
                      onChange={(e) => handleValueChange(s.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Enregistrer">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleUpdate(s.id, s.value)}
                        disabled={saving[s.id]}
                      >
                        {saving[s.id] ? <CircularProgress size={20} /> : <SaveIcon />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {settings.length === 0 && (
                <TableRow><TableCell colSpan={4} align="center">Aucun paramètre trouvé.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Settings;
