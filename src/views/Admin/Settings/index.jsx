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
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import api from 'api';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({}); // Tracking which ID is saving
  const [open, setOpen] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: '', description: '', value: '' });

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

  const handleCreate = async () => {
    if (!newSetting.key) return;
    try {
      await api.post('/api/settings/', newSetting);
      setOpen(false);
      setNewSetting({ key: '', description: '', value: '' });
      fetchSettings();
    } catch (err) {
      alert(`Erreur de création: ${err.message}`);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3">Configuration du Système</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Nouveau Paramètre
        </Button>
      </Box>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un nouveau paramètre</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Clé"
              fullWidth
              value={newSetting.key}
              onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
              placeholder="ex: EMAIL_NOTIF"
            />
            <TextField
              label="Description"
              fullWidth
              value={newSetting.description}
              onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
              placeholder="Courte description de l'utilité"
            />
            <TextField
              label="Valeur Initiale"
              fullWidth
              value={newSetting.value}
              onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleCreate}>Créer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
