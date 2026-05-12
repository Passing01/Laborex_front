import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Button,
  TextField,
  MenuItem,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from 'api';
import { useAuth } from 'context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GavelIcon from '@mui/icons-material/Gavel';
import FolderIcon from '@mui/icons-material/Folder';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentIcon from '@mui/icons-material/Assignment';

const getDocIcon = (type) => {
  switch (type) {
    case 'FACTURE': return <ReceiptIcon size="small" />;
    case 'ADI': return <AssignmentIcon size="small" />;
    case 'CCPQ': return <VerifiedIcon size="small" />;
    case 'REC165': return <DescriptionIcon size="small" />;
    case 'LIQUIDATION': return <GavelIcon size="small" />;
    default: return <FolderIcon size="small" />;
  }
};

const getDocColor = (type) => {
  switch (type) {
    case 'FACTURE': return '#2196f3';
    case 'ADI': return '#4caf50';
    case 'CCPQ': return '#ff9800';
    case 'REC165': return '#9c27b0';
    case 'LIQUIDATION': return '#f44336';
    default: return '#757575';
  }
};

const BexDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bex, setBex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('FACTURE');

  const fetchDetails = async () => {
    try {
      // First try: dossier-complet
      const data = await api.get(`/api/transit/bex/${id}/dossier-complet/`);
      setBex(data);
    } catch (err) {
      console.warn('Dossier complet not found, trying basic endpoint...', err);
      try {
        // Fallback: basic bex endpoint
        const basicData = await api.get(`/api/transit/bex/${id}/`);
        setBex(basicData);
      } catch (fallbackErr) {
        console.error('BEX not found', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('type_document', docType);

    setUploading(true);
    try {
      await api.post(`/api/transit/bex/${id}/upload-document/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDetails();
    } catch (err) {
      alert(`Erreur d'upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleValidate = async () => {
    if (!window.confirm('Voulez-vous valider officiellement ce dossier ?')) return;
    try {
      await api.post(`/api/transit/bex/${id}/valider/`);
      fetchDetails();
    } catch (err) {
      alert(`Erreur de validation: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <Box p={3} textAlign="center"><CircularProgress /><Typography mt={2}>Chargement des détails...</Typography></Box>;
  if (!bex) return <Box p={3}><Alert severity="error">Dossier BEX introuvable.</Alert></Box>;

  const { user } = useAuth();
  const canValidate = (user?.role === 'CHEF' || user?.role === 'CHEF_SERVICE') && bex.statut !== 'VALIDE';

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/transit/bex')}>Retour</Button>
          <Typography variant="h3">Dossier BEX: {bex.numero_bex}</Typography>
        </Box>
        {canValidate && (
          <Button 
            variant="contained" 
            color="success" 
            size="large"
            startIcon={<VerifiedIcon />}
            onClick={handleValidate}
          >
            VALIDER LE DOSSIER
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" mb={3}>Informations Générales</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="caption" color="textSecondary">Type de Transport</Typography>
                <Typography variant="body1" fontWeight="bold">{bex.type_bex}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Fournisseur</Typography>
                <Typography variant="body1" fontWeight="bold">{bex.fournisseur}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Date d'Enlèvement</Typography>
                <Typography variant="body1" fontWeight="bold">{bex.date_enlevement_prevue || 'Non définie'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>Statut Actuel</Typography>
                <Chip 
                  label={bex.statut_display || bex.statut} 
                  color="primary" 
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 0, height: '100%' }}>
            <Box p={3} sx={{ borderBottom: '1px solid #eee' }}>
              <Typography variant="h5">Lignes Produits & Conteneurs</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Conteneur</TableCell>
                    <TableCell>Désignation</TableCell>
                    <TableCell align="right">Qté</TableCell>
                    <TableCell align="right">Valeur FCFA</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bex.items?.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.numero_conteneur || '-'}</TableCell>
                      <TableCell>{item.designation_produit}</TableCell>
                      <TableCell align="right">{item.quantite}</TableCell>
                      <TableCell align="right">{item.facture_fcfa?.toLocaleString()} FCFA</TableCell>
                    </TableRow>
                  ))}
                  {(!bex.items || bex.items.length === 0) && (
                    <TableRow><TableCell colSpan={4} align="center">Aucun produit listé.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 0 }}>
            <Box p={3} sx={{ borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Gestion Documentaire</Typography>
              <Chip label={`${bex.documents?.length || 0} Fichiers rattachés`} size="small" color="secondary" />
            </Box>
            <Box p={3}>
              <Grid container spacing={4}>
                {/* Colonne Gauche : Upload */}
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" mb={2} fontWeight="bold">Ajouter un document</Typography>
                  <Box 
                    sx={{ 
                      p: 3, 
                      border: '2px dashed #e0e0e0', 
                      borderRadius: 2, 
                      bgcolor: '#fafafa',
                    }}
                  >
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        select
                        fullWidth
                        label="Type de document"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        size="small"
                      >
                        <MenuItem value="FACTURE">Facture Commerciale</MenuItem>
                        <MenuItem value="ADI">Autorisation ADI</MenuItem>
                        <MenuItem value="CCPQ">Certificat CCPQ</MenuItem>
                        <MenuItem value="REC165">Reçu 165</MenuItem>
                        <MenuItem value="LIQUIDATION">Liquidation Douane</MenuItem>
                        <MenuItem value="AUTRE">Autre</MenuItem>
                      </TextField>
                      
                      <input
                        accept="application/pdf,image/*"
                        style={{ display: 'none' }}
                        id="doc-upload"
                        type="file"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="doc-upload">
                        <Button 
                          fullWidth 
                          variant="contained" 
                          component="span" 
                          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <FileUploadIcon />}
                          disabled={uploading}
                        >
                          {uploading ? 'Upload en cours...' : 'Choisir le fichier'}
                        </Button>
                      </label>
                      <Typography variant="caption" color="textSecondary" textAlign="center">
                        PDF, JPG ou PNG (Max 5Mo)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Colonne Droite : Liste des documents */}
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" mb={2} fontWeight="bold">Documents existants</Typography>
                  <Grid container spacing={2}>
                    {bex.documents?.map((doc) => (
                      <Grid item xs={12} key={doc.id}>
                        <Box 
                          sx={{ 
                            p: 2, 
                            border: '1px solid #f0f0f0', 
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            '&:hover': { bgcolor: '#fcfcfc' }
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: getDocColor(doc.type_document) }}>
                              {getDocIcon(doc.type_document)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">{doc.type_document}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                Par {doc.agent_createur_name} le {new Date(doc.date_upload).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            href={doc.fichier} 
                            target="_blank"
                            startIcon={<VisibilityIcon />}
                          >
                            Voir
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                    {(!bex.documents || bex.documents.length === 0) && (
                      <Grid item xs={12}>
                        <Box p={3} textAlign="center" sx={{ bgcolor: '#f9f9f9', borderRadius: 2 }}>
                          <Typography variant="body2" color="textSecondary">Aucun document rattaché.</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BexDetails;
