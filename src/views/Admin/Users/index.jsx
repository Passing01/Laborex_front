import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import api from 'api';
import { useAuth } from 'context/AuthContext';
import AddIcon from '@mui/icons-material/Add';

const UserList = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'AGENT',
    first_name: '',
    last_name: ''
  });

  const fetchUsers = async () => {
    try {
      const data = await api.get('/api/users/');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleCreate = async () => {
    try {
      await api.post('/api/users/', newUser);
      setOpen(false);
      fetchUsers();
      setNewUser({ username: '', password: '', role: 'AGENT', first_name: '', last_name: '' });
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await api.patch(`/api/users/${userId}/`, { is_active: !currentStatus });
      fetchUsers();
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  if (!isAdmin) {
    return <Typography color="error">Accès refusé. Vous devez être administrateur.</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3">Gestion des Utilisateurs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Nouveau Utilisateur
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Nom complet</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell><strong>{u.username}</strong></TableCell>
                  <TableCell>{u.first_name} {u.last_name}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Chip 
                        label={u.role_display || u.role} 
                        size="small" 
                        color={u.role === 'ADMIN' ? 'error' : 'primary'} 
                        variant="outlined" 
                      />
                      <Chip 
                        label={u.is_active !== false ? 'Actif' : 'Inactif'} 
                        size="small" 
                        color={u.is_active !== false ? 'success' : 'default'} 
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      color={u.is_active !== false ? 'error' : 'success'} 
                      variant="contained"
                      onClick={() => handleToggleActive(u.id, u.is_active !== false)}
                      disabled={u.role === 'ADMIN'}
                    >
                      {u.is_active !== false ? 'Désactiver' : 'Activer'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nom d'utilisateur"
              fullWidth
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Prénom"
                fullWidth
                value={newUser.first_name}
                onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              />
              <TextField
                label="Nom"
                fullWidth
                value={newUser.last_name}
                onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
              />
            </Box>
            <TextField
              select
              label="Rôle"
              fullWidth
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="AGENT">Agent</MenuItem>
              <MenuItem value="CHEF_SERVICE">Chef de Service</MenuItem>
              <MenuItem value="ADMIN">Administrateur (RSI)</MenuItem>
            </TextField>
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

export default UserList;
