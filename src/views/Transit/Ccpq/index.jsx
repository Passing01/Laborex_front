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
import AddIcon from '@mui/icons-material/Add';

const CcpqList = () => {
  const navigate = useNavigate();
  const [ccpqList, setCcpqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchCcpq = async () => {
    try {
      const data = await api.get(`/api/transit/ccpq/?search=${search}`);
      setCcpqList(data);
    } catch (err) {
      console.error('Failed to fetch CCPQ', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/transit/ccpq/${id}/`, { statut: newStatus });
      fetchCcpq();
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
      await api.post('/api/transit/ccpq/import-excel/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchCcpq();
    } catch (err) {
      alert(`Erreur d'importation: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchCcpq();
  }, [search]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'NON_DEMARRE': return 'default';
      case 'EN_ANALYSE': return 'info';
      case 'APPROUVE': return 'success';
      case 'REJETE': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3">Dossiers CCPQ</Typography>
        <Box display="flex" gap={2}>
          <input
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
            id="ccpq-excel-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="ccpq-excel-upload">
            <Button 
              variant="outlined" 
              component="span" 
              startIcon={<UploadFileIcon />}
              disabled={uploading}
            >
              {uploading ? 'Importation...' : 'Importer Excel'}
            </Button>
          </label>
          <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/transit/ccpq/create">
            Nouveau CCPQ
          </Button>
        </Box>
      </Box>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            placeholder="Rechercher par numéro CCPQ..."
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
                <TableCell>Numéro CCPQ</TableCell>
                <TableCell>Date Dépôt</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center">Chargement...</TableCell></TableRow>
              ) : ccpqList.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center">Aucun dossier trouvé</TableCell></TableRow>
              ) : ccpqList.map((ccpq) => (
                <TableRow key={ccpq.id} hover>
                  <TableCell><strong>{ccpq.numero_ccpq}</strong></TableCell>
                  <TableCell>{ccpq.date_depot || 'N/A'}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={ccpq.statut}
                      onChange={(e) => handleStatusChange(ccpq.id, e.target.value)}
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="NON_DEMARRE">Non démarré</MenuItem>
                      <MenuItem value="EN_ANALYSE">En analyse</MenuItem>
                      <MenuItem value="APPROUVE">Approuvé</MenuItem>
                      <MenuItem value="REJETE">Rejeté</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/transit/ccpq/${ccpq.id}`)}
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

export default CcpqList;
