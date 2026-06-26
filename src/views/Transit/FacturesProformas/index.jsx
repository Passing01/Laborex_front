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
  IconButton
} from '@mui/material';
import api from 'api';
import { Link, useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from 'context/AuthContext';
import Swal from 'sweetalert2';

const FacturesProformasList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const isChef = user?.role === 'CHEF' || user?.role === 'CHEF_SERVICE';

  const fetchFactures = async () => {
    try {
      const data = await api.get(`/api/transit/factures-proformas/?search=${search}`);
      setFactures(data);
    } catch (err) {
      console.error('Failed to fetch Factures', err);
    } finally {
      setLoading(false);
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
      const result = await api.post('/api/transit/factures-proformas/import-excel/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchFactures();
      Swal.fire({
        icon: 'success',
        title: 'Importation réussie !',
        html: result?.message
          ? `<p>${result.message}</p>`
          : `<p>Les factures proformas ont été importées avec succès depuis <strong>${file.name}</strong>.</p>`,
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment supprimer cette facture proforma ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/transit/factures-proformas/${id}/`);
        fetchFactures();
        Swal.fire('Supprimé !', 'La facture a été supprimée.', 'success');
      } catch (err) {
        Swal.fire('Erreur', 'Impossible de supprimer la facture.', 'error');
      }
    }
  };

  useEffect(() => {
    fetchFactures();
  }, [search]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3">Factures Proformas</Typography>
        <Box display="flex" gap={2}>
          {isChef && (
            <>
              <input
                accept=".xlsx, .xls"
                style={{ display: 'none' }}
                id="excel-upload-factures"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="excel-upload-factures">
                <Button 
                  variant="outlined" 
                  component="span" 
                  startIcon={<UploadFileIcon />}
                  disabled={uploading}
                >
                  {uploading ? 'Importation...' : 'Importer Excel'}
                </Button>
              </label>
              <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/transit/factures-proformas/create">
                Renseigner
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            placeholder="Rechercher une facture..."
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
                <TableCell>Référence</TableCell>
                <TableCell>Nombre d'items</TableCell>
                <TableCell>Quantité Produits</TableCell>
                <TableCell>Coût Facture</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center">Chargement...</TableCell></TableRow>
              ) : factures.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">Aucune facture trouvée</TableCell></TableRow>
              ) : factures.map((facture) => (
                <TableRow key={facture.id} hover>
                  <TableCell><strong>{facture.reference}</strong></TableCell>
                  <TableCell>{facture.nombre_item}</TableCell>
                  <TableCell>{facture.quantite_produits}</TableCell>
                  <TableCell>{facture.cout_facture}</TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      {isChef && (
                        <>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => navigate(`/transit/factures-proformas/${facture.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(facture.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
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

export default FacturesProformasList;
