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
  MenuItem,
  Tooltip,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import api from 'api';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { useAuth } from 'context/AuthContext';

const AdiList = () => {
  const navigate = useNavigate();
  const [adiList, setAdiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alerteFilter, setAlerteFilter] = useState('TOUS');
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

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
      Swal.fire({
        icon: 'error',
        title: 'Erreur de mise à jour',
        text: err.data?.detail || err.message || 'Une erreur est survenue.'
      });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
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
      const result = await api.post('/api/transit/adi/import-excel/', formData);
      await fetchAdi();
      Swal.fire({
        icon: 'success',
        title: 'Importation réussie !',
        html: result?.message
          ? `<p>${result.message}</p>`
          : `<p>Les dossiers ADI ont été importés avec succès depuis <strong>${file.name}</strong>.</p>`,
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

  const filteredAdiList = adiList.filter(adi => {
    if (alerteFilter === 'TOUS') return true;
    return adi.alerte_retard?.statut === alerteFilter;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3">Dossiers ADI</Typography>
        <Box display="flex" gap={2}>
          {!isAdmin && (
            <>
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
            </>
          )}
        </Box>
      </Box>

      <Card>
        <Box p={2} display="flex" gap={2}>
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
                <TableCell>Numéro ADI</TableCell>
                <TableCell>Factures</TableCell>
                <TableCell>Fournisseur</TableCell>
                <TableCell>Date Réception</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Alerte</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center">Chargement...</TableCell></TableRow>
              ) : filteredAdiList.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center">Aucun dossier trouvé</TableCell></TableRow>
              ) : filteredAdiList.map((adi) => (
                <TableRow 
                  key={adi.id} 
                  hover
                  sx={adi.alerte_retard?.statut === 'DEPASSE' ? { backgroundColor: '#fee2e2' } : {}}
                >
                  <TableCell><strong>{adi.numero_adi}</strong></TableCell>
                  <TableCell>{adi.factures || 'N/A'}</TableCell>
                  <TableCell>{adi.fournisseur || 'N/A'}</TableCell>
                  <TableCell>{adi.date_reception || 'N/A'}</TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <Chip label={adi.statut} color={getStatusColor(adi.statut)} size="small" />
                    ) : (
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
                    )}
                  </TableCell>
                  <TableCell>
                    {renderAlerteBadge(adi.alerte_retard)}
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
