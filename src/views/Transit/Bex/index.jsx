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
  Tooltip,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import api from 'api';
import { Link, useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from 'context/AuthContext';
import Swal from 'sweetalert2';

const BexList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bexList, setBexList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alerteFilter, setAlerteFilter] = useState('TOUS');
  const [uploading, setUploading] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isChef = user?.role === 'CHEF' || user?.role === 'CHEF_SERVICE';
  const isAgent = user?.role === 'AGENT';

  const fetchBex = async () => {
    try {
      const data = await api.get(`/api/transit/bex/?search=${search}`);
      setBexList(data);
    } catch (err) {
      console.error('Failed to fetch BEX', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    try {
      await api.post(`/api/transit/bex/${id}/valider/`);
      fetchBex();
      await Swal.fire({
        icon: 'success',
        title: 'Dossier validé !',
        text: 'Le dossier BEX a été validé avec succès.',
        timer: 2500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de validation',
        text: err.data?.detail || err.message || 'Une erreur est survenue.'
      });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    // Reset pour permettre de re-sélectionner le même fichier
    event.target.value = null;

    const formData = new FormData();
    formData.append('file', file);

    Swal.fire({
      title: 'Importation en cours...',
      html: `Traitement du fichier <strong>${file.name}</strong>.<br/>Veuillez patienter.`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => { Swal.showLoading(); }
    });

    setUploading(true);
    try {
      const result = await api.post('/api/transit/bex/import-excel/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchBex();
      Swal.fire({
        icon: 'success',
        title: 'Importation réussie !',
        html: result?.message
          ? `<p>${result.message}</p>`
          : `<p>Les dossiers BEX ont été importés avec succès depuis <strong>${file.name}</strong>.</p>`,
        confirmButtonText: 'Fermer'
      });
    } catch (err) {
      const detail = err.data?.detail || err.data?.error || err.message || 'Une erreur inattendue est survenue.';
      Swal.fire({
        icon: 'error',
        title: "Erreur d'importation",
        html: `<p>${detail}</p><br/><small>Vérifiez que le fichier Excel est au bon format.</small>`,
        confirmButtonText: 'Compris'
      });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchBex();
  }, [search]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return 'warning';
      case 'VALIDE': return 'success';
      case 'DEDOUANE': return 'info';
      default: return 'default';
    }
  };

  const renderAlerteBadge = (alerte_retard) => {
    if (!alerte_retard) return null;
    const { statut, jours_restants, deadline } = alerte_retard;
    
    let color, label, icon;
    switch(statut) {
      case 'NORMAL':
        color = 'success';
        label = `Dans les temps (Reste ${jours_restants} j)`;
        break;
      case 'PROCHE':
        color = 'warning';
        icon = '⚠️';
        label = `Échéance proche (${jours_restants} j)`;
        break;
      case 'DEPASSE':
        color = 'error';
        icon = '🚨';
        label = `En retard de ${Math.abs(jours_restants)} j`;
        break;
      case 'TERMINE':
        color = 'info';
        label = 'Clôturé';
        break;
      default:
        return null;
    }
    
    return (
      <Tooltip title={`Date limite: ${deadline || 'N/A'}`}>
        <Chip 
          icon={icon ? <span>{icon}</span> : undefined} 
          label={label} 
          color={color} 
          size="small" 
          variant={statut === 'DEPASSE' ? 'filled' : 'outlined'}
          sx={statut === 'NORMAL' ? { color: '#10B981', borderColor: '#10B981' } : {}}
        />
      </Tooltip>
    );
  };

  const filteredBexList = bexList.filter(bex => {
    if (alerteFilter === 'TOUS') return true;
    return bex.alerte_retard?.statut === alerteFilter;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3">Dossiers BEX</Typography>
        <Box display="flex" gap={2}>
          {!isAdmin && (
            <>
              <input
                accept=".xlsx, .xls"
                style={{ display: 'none' }}
                id="excel-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="excel-upload">
                <Button 
                  variant="outlined" 
                  component="span" 
                  startIcon={<UploadFileIcon />}
                  disabled={uploading}
                >
                  {uploading ? 'Importation...' : 'Importer Excel'}
                </Button>
              </label>
              <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/transit/bex/create">
                Nouveau BEX
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Card>
        <Box p={2} display="flex" gap={2}>
          <TextField
            fullWidth
            placeholder="Rechercher par numéro BEX..."
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
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="alerte-filter-label">Filtrer par Alerte</InputLabel>
            <Select
              labelId="alerte-filter-label"
              value={alerteFilter}
              label="Filtrer par Alerte"
              onChange={(e) => setAlerteFilter(e.target.value)}
            >
              <MenuItem value="TOUS">Tous</MenuItem>
              <MenuItem value="NORMAL">Dans les temps</MenuItem>
              <MenuItem value="PROCHE">Échéance proche (Urgent)</MenuItem>
              <MenuItem value="DEPASSE">En retard</MenuItem>
              <MenuItem value="TERMINE">Clôturé</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Numéro BEX</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Fournisseur</TableCell>
                <TableCell>Date Enlèvement</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Alerte</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center">Chargement...</TableCell></TableRow>
              ) : filteredBexList.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center">Aucun dossier trouvé</TableCell></TableRow>
              ) : filteredBexList.map((bex) => (
                <TableRow 
                  key={bex.id} 
                  hover
                  sx={bex.alerte_retard?.statut === 'DEPASSE' ? { backgroundColor: '#fee2e2' } : {}}
                >
                  <TableCell><strong>{bex.numero_bex}</strong></TableCell>
                  <TableCell>{bex.type_bex}</TableCell>
                  <TableCell>{bex.fournisseur}</TableCell>
                  <TableCell>{bex.date_enlevement_prevue || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={bex.statut_display || bex.statut} 
                      color={getStatusColor(bex.statut)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {renderAlerteBadge(bex.alerte_retard)}
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => navigate(`/transit/bex/${bex.id}`)}
                      >
                        Détails
                      </Button>
                      {isChef && bex.statut === 'EN_ATTENTE' && (
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="success"
                          onClick={() => handleValidate(bex.id)}
                        >
                          Valider
                        </Button>
                      )}
                    </Box>
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

export default BexList;
