import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  Button, 
  Chip,
  TextField,
  InputAdornment,
  MenuItem
} from '@mui/material';
import api from 'api';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';

const AdiList = () => {
  const navigate = useNavigate();
  const [adiList, setAdiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchAdi = async () => {
    try {
      const data = await api.get(`/api/transit/adi/?search=${search}`);
      setAdiList(data);
    } catch (err) {
      console.error('Failed to fetch ADI', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/transit/adi/${id}/`, { statut: newStatus });
      fetchAdi();
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/api/transit/adi/import-excel/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAdi();
    } catch (err) {
      alert(`Erreur d'importation: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchAdi();
  }, [search]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return 'warning';
      case 'SOUMIS': return 'info';
      case 'VALIDE': return 'success';
      case 'REJETE': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3">Dossiers ADI</Typography>
        <Box display="flex" gap={2}>
          <input
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
            id="adi-excel-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="adi-excel-upload">
            <Button 
              variant="outlined" 
              component="span" 
              startIcon={<UploadFileIcon />}
              disabled={uploading}
            >
              {uploading ? 'Importation...' : 'Importer Excel'}
            </Button>
          </label>
          <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/transit/adi/create">
            Nouveau ADI
          </Button>
        </Box>
      </Box>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            placeholder="Rechercher par numéro ADI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Numéro ADI</TableCell>
                <TableCell>Fournisseur</TableCell>
                <TableCell>Pays</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow>
              ) : adiList.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">Aucun dossier trouvé</TableCell></TableRow>
              ) : adiList.map((adi) => (
                <TableRow key={adi.id} hover>
                  <TableCell><strong>{adi.numero_adi}</strong></TableCell>
                  <TableCell>{adi.fournisseur || 'N/A'}</TableCell>
                  <TableCell>{adi.pays || 'N/A'}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={adi.statut}
                      onChange={(e) => handleStatusChange(adi.id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="EN_ATTENTE">En attente</MenuItem>
                      <MenuItem value="SOUMIS">Soumis</MenuItem>
                      <MenuItem value="VALIDE">Valide</MenuItem>
                      <MenuItem value="REJETE">Rejeté</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/transit/adi/${adi.id}`)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AdiList;
