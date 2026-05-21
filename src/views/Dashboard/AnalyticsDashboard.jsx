import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Box,
  Button,
  Chip,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Paper,
  CircularProgress,
  LinearProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

// third-party (Chart.js & React-Chartjs-2)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// project import
import api from 'api';
import { useAuth } from 'context/AuthContext';
import { gridSpacing } from 'config.js';

// assets
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionTwoTone from '@mui/icons-material/DescriptionTwoTone';
import WarningTwoTone from '@mui/icons-material/WarningTwoTone';
import AssessmentTwoTone from '@mui/icons-material/AssessmentTwoTone';
import FilterListTwoTone from '@mui/icons-material/FilterListTwoTone';
import RefreshTwoTone from '@mui/icons-material/RefreshTwoTone';
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';
import LaunchTwoTone from '@mui/icons-material/LaunchTwoTone';
import CheckCircleTwoTone from '@mui/icons-material/CheckCircleTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import ShieldTwoToneIcon from '@mui/icons-material/ShieldTwoTone';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

import { motion } from 'framer-motion';

const PremiumCard = styled(motion(Card))(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '16px',
  boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  border: '1px solid ' + theme.palette.divider,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.12)'
  }
}));

const CardGradientBg = styled(Box)(({ color1, color2 }) => ({
  position: 'absolute',
  top: '-50px',
  right: '-50px',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
  opacity: 0.12,
  zIndex: 0
}));

const fallbackData = {
  active_counts: {
    BEX: 12,
    ADI: 8,
    CCPQ: 6,
    Conteneur: 4
  },
  total_active_dossiers: 30,
  blocked_count: 5,
  avg_delays: {
    BEX: 11.2,
    ADI: 4.2,
    CCPQ: 5.8
  },
  validation_rate: 76.5,
  charts: {
    grouped_bars: [
      { month: "Janvier 2026", BEX: 2, ADI: 1, CCPQ: 1 },
      { month: "Février 2026", BEX: 5, ADI: 3, CCPQ: 2 },
      { month: "Mars 2026", BEX: 8, ADI: 6, CCPQ: 4 },
      { month: "Avril 2026", BEX: 11, ADI: 7, CCPQ: 5 },
      { month: "Mai 2026", BEX: 12, ADI: 8, CCPQ: 6 }
    ],
    pie_causes: [
      { label: "Retards ADI", value: 3 },
      { label: "Retards CCPQ", value: 2 },
      { label: "Retards Douane", value: 4 },
      { label: "Autres Causes", value: 1 }
    ],
    trend_weeks: [
      { week: "Semaine 18", avg_days: 4.2 },
      { week: "Semaine 19", avg_days: 6.8 },
      { week: "Semaine 20", avg_days: 5.1 },
      { week: "Semaine 21", avg_days: 3.5 },
      { week: "Semaine 22", avg_days: 4.8 }
    ]
  },
  late_dossiers_table: [
    {
      id: 1,
      numero: "BEX-2026-042",
      type: "BEX",
      statut: "BLOQUE",
      date_depot_creation: "2026-05-02",
      agent_responsable: "Jean Transit (agent1)",
      jours_retard: 19,
      seuil_limite: 15
    },
    {
      id: 2,
      numero: "ADI-2026-089",
      type: "ADI",
      statut: "EN_ATTENTE",
      date_depot_creation: "2026-05-15",
      agent_responsable: "Jean Transit (agent1)",
      jours_retard: 6,
      seuil_limite: 5
    },
    {
      id: 3,
      numero: "CCPQ-2026-015",
      type: "CCPQ",
      statut: "EN_ATTENTE",
      date_depot_creation: "2026-05-13",
      agent_responsable: "Jean Transit (agent1)",
      jours_retard: 8,
      seuil_limite: 7
    }
  ],
  filters_metadata: {
    agents: [
      { id: 2, name: "Jean Transit (agent1)" },
      { id: 3, name: "Marie Transit (agent2)" }
    ],
    types: ["BEX", "ADI", "CCPQ", "CONTENEUR"],
    periods: [
      { key: "semaine", label: "Semaine" },
      { key: "mois", label: "Mois" },
      { key: "trimestre", label: "Trimestre" }
    ]
  }
};

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [periode, setPeriode] = useState('mois');
  const [typeDossier, setTypeDossier] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  const [dashboardData, setDashboardData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (periode) queryParams.push(`periode=${periode}`);
      if (typeDossier) queryParams.push(`type_dossier=${typeDossier}`);
      if (user?.role !== 'AGENT' && selectedAgent) {
        queryParams.push(`agent_id=${selectedAgent}`);
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await api.get(`/api/analytics/dashboard-data/${queryString}`);
      
      const processed = {
        ...response,
        filters_metadata: response.filters_metadata || fallbackData.filters_metadata
      };
      setDashboardData(processed);
      setIsSandboxMode(false);
    } catch (err) {
      console.warn("API analytics dashboard-data inaccessible, bascule sur les données simulées :", err);
      setDashboardData(fallbackData);
      setIsSandboxMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [periode, typeDossier, selectedAgent, user]);

  const handleResetFilters = () => {
    setPeriode('mois');
    setTypeDossier('');
    setSelectedAgent('');
  };

  const handleDownloadExcel = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (periode) queryParams.append('periode', periode);
      if (typeDossier) queryParams.append('type_dossier', typeDossier);
      if (user?.role !== 'AGENT' && selectedAgent) {
        queryParams.append('agent_id', selectedAgent);
      }

      const response = await api.get('/api/analytics/export-excel/', {
        responseType: 'blob',
        params: queryParams
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Rapport_Dashboard_Laborex.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur de téléchargement :', error);
      alert('Impossible de télécharger le rapport Excel.');
    }
  };

  if (loading || !dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  const barChartData = {
    labels: dashboardData.charts?.grouped_bars?.map(x => x.month) || [],
    datasets: [
      {
        label: 'BEX',
        data: dashboardData.charts?.grouped_bars?.map(x => x.BEX) || [],
        backgroundColor: '#2196f3',
        borderRadius: 4
      },
      {
        label: 'ADI',
        data: dashboardData.charts?.grouped_bars?.map(x => x.ADI) || [],
        backgroundColor: '#4caf50',
        borderRadius: 4
      },
      {
        label: 'CCPQ',
        data: dashboardData.charts?.grouped_bars?.map(x => x.CCPQ) || [],
        backgroundColor: '#ff9800',
        borderRadius: 4
      }
    ]
  };

  const pieChartData = {
    labels: dashboardData.charts?.pie_causes?.map(x => x.label) || [],
    datasets: [{
      data: dashboardData.charts?.pie_causes?.map(x => x.value) || [],
      backgroundColor: ['#f44336', '#9c27b0', '#ffc107', '#9e9e9e'],
      borderWidth: 1,
      borderColor: theme.palette.background.paper
    }]
  };

  const lineChartData = {
    labels: dashboardData.charts?.trend_weeks?.map(x => x.week) || [],
    datasets: [{
      label: 'Délai moyen (jours)',
      data: dashboardData.charts?.trend_weeks?.map(x => x.avg_days) || [],
      borderColor: '#3f51b5',
      backgroundColor: 'rgba(63, 81, 181, 0.08)',
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const isAgent = user?.role === 'AGENT';
  const roleLabel = isAgent ? 'Agent de Transit' : user?.role === 'CHEF_SERVICE' ? 'Chef de Service' : 'Administrateur (RSI)';

  return (
    <Box>
      <Grid container spacing={gridSpacing}>
        {/* Header */}
        <Grid item xs={12}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={1}>
            <Box>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                Tableau de Bord Décisionnel - Suivi Documentaire
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Bienvenue, <strong>{user?.first_name || user?.username}</strong> ({roleLabel})! 
                {isAgent ? (
                  <Chip icon={<ShieldTwoToneIcon fontSize="small" />} label="Sécurité des Lignes Activée (Mes Dossiers)" size="small" color="primary" sx={{ height: 20 }} />
                ) : (
                  <Chip icon={<ShieldTwoToneIcon fontSize="small" />} label="Accès Global Entreprise" size="small" color="success" sx={{ height: 20 }} />
                )}
              </Typography>
            </Box>
            <Box display="flex" gap={1} mt={{ xs: 2, md: 0 }} alignItems="center">
              {isSandboxMode && (
                <Chip
                  avatar={<Avatar sx={{ bgcolor: theme.palette.warning.dark }}>!</Avatar>}
                  label="Mode Bac à Sable"
                  variant="outlined"
                  color="warning"
                  sx={{ borderRadius: '8px', fontWeight: 600 }}
                />
              )}
              <Button
                variant="contained"
                color="success"
                startIcon={<DownloadTwoToneIcon />}
                onClick={handleDownloadExcel}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
              >
                Export Excel
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* --- FILTERS BAR --- */}
        <Grid item xs={12}>
          <PremiumCard>
            <CardContent sx={{ py: '16px !important' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FilterListTwoTone color="action" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Filtres Analytiques
                    </Typography>
                  </Box>
                </Grid>

                {/* Period Selector */}
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Période</InputLabel>
                    <Select value={periode} label="Période" onChange={e => setPeriode(e.target.value)}>
                      {dashboardData.filters_metadata?.periods?.map(p => (
                        <MenuItem key={p.key} value={p.key}>{p.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Folder Type Selector */}
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type Dossier</InputLabel>
                    <Select value={typeDossier} label="Type Dossier" onChange={e => setTypeDossier(e.target.value)}>
                      <MenuItem value="">Tous les types</MenuItem>
                      {dashboardData.filters_metadata?.types?.map(t => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Agent Selector */}
                {!isAgent && (
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Agent Responsable</InputLabel>
                      <Select value={selectedAgent} label="Agent Responsable" onChange={e => setSelectedAgent(e.target.value)}>
                        <MenuItem value="">Tous les agents (Global)</MenuItem>
                        {dashboardData.filters_metadata?.agents?.map(a => (
                          <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* Action Buttons */}
                <Grid item xs={12} sm={isAgent ? 5 : 2} textAlign="right" display="flex" gap={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    startIcon={<RefreshTwoTone />}
                    onClick={handleResetFilters}
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={fetchDashboardData}
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                  >
                    Actualiser
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </PremiumCard>
        </Grid>

        {/* --- KPI CARDS SECTION --- */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            {/* Card 1: Active Dossiers Count */}
            <Grid item lg={3} sm={6} xs={12}>
              <PremiumCard>
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  <CardGradientBg color1={theme.palette.primary.main} color2={theme.palette.primary.light} />
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" zIndex={1} position="relative">
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary" fontWeight={600} gutterBottom>
                        {isAgent ? "MES DOSSIERS ACTIFS" : "DOSSIERS ACTIFS"}
                      </Typography>
                      <Typography variant="h1" sx={{ color: '#1976d2', fontWeight: 800 }}>
                        {dashboardData.total_active_dossiers}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main, width: 48, height: 48 }}>
                      <DescriptionTwoTone />
                    </Avatar>
                  </Box>
                  <Box mt={2} zIndex={1} position="relative">
                    <Grid container spacing={1}>
                      {Object.entries(dashboardData.active_counts || {}).map(([key, val]) => (
                        <Grid item key={key}>
                          <Chip
                            label={`${key}: ${val}`}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.primary.light + '20',
                              color: theme.palette.primary.dark,
                              fontWeight: 600,
                              borderRadius: '4px'
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </PremiumCard>
            </Grid>

            {/* Card 2: Blocked / Late Count */}
            <Grid item lg={3} sm={6} xs={12}>
              <PremiumCard>
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  <CardGradientBg color1={theme.palette.error.main} color2={theme.palette.error.light} />
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" zIndex={1} position="relative">
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary" fontWeight={600} gutterBottom>
                        DOSSIERS EN RETARD / BLOQUÉS
                      </Typography>
                      <Typography variant="h1" sx={{ color: '#d32f2f', fontWeight: 800 }}>
                        {dashboardData.blocked_count}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: theme.palette.error.light + '20', color: theme.palette.error.main, width: 48, height: 48 }}>
                      <WarningTwoTone />
                    </Avatar>
                  </Box>
                  <Box mt={2} zIndex={1} position="relative">
                    <Typography variant="body2" color="error" fontWeight={500} display="flex" alignItems="center" gap={0.5}>
                      <InfoTwoTone fontSize="inherit" />
                      Dossiers hors limites SLA
                    </Typography>
                  </Box>
                </CardContent>
              </PremiumCard>
            </Grid>

            {/* Card 3: Validation Rate */}
            <Grid item lg={3} sm={6} xs={12}>
              <PremiumCard>
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  <CardGradientBg color1={theme.palette.success.main} color2={theme.palette.success.light} />
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" zIndex={1} position="relative">
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary" fontWeight={600} gutterBottom>
                        TAUX DE VALIDATION SLA
                      </Typography>
                      <Typography variant="h1" sx={{ color: '#388e3c', fontWeight: 800 }}>
                        {dashboardData.validation_rate}%
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: theme.palette.success.light + '20', color: theme.palette.success.main, width: 48, height: 48 }}>
                      <CheckCircleTwoTone />
                    </Avatar>
                  </Box>
                  <Box mt={2} zIndex={1} position="relative">
                    <LinearProgress
                      variant="determinate"
                      value={dashboardData.validation_rate || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': { bgcolor: theme.palette.success.main }
                      }}
                    />
                  </Box>
                </CardContent>
              </PremiumCard>
            </Grid>

            {/* Card 4: Average Delays */}
            <Grid item lg={3} sm={6} xs={12}>
              <PremiumCard>
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  <CardGradientBg color1={theme.palette.warning.main} color2={theme.palette.warning.light} />
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" zIndex={1} position="relative">
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary" fontWeight={600} gutterBottom>
                        DÉLAIS MOYENS CE MOIS
                      </Typography>
                      <Box display="flex" gap={1.5} alignItems="baseline" mt={1}>
                        <Typography variant="h3" sx={{ color: '#f57c00', fontWeight: 700 }}>
                          BEX: {dashboardData.avg_delays?.BEX || 0}j
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#f57c00', fontWeight: 700 }}>
                          ADI: {dashboardData.avg_delays?.ADI || 0}j
                        </Typography>
                      </Box>
                    </Box>
                    <Avatar sx={{ bgcolor: theme.palette.warning.light + '20', color: theme.palette.warning.main, width: 48, height: 48 }}>
                      <AccessTimeTwoToneIcon />
                    </Avatar>
                  </Box>
                  <Box mt={1.5} zIndex={1} position="relative">
                    <Typography variant="caption" color="textSecondary">
                      Seuils limites de transit : BEX: 15j | ADI: 5j | CCPQ: 7j.
                    </Typography>
                  </Box>
                </CardContent>
              </PremiumCard>
            </Grid>
          </Grid>
        </Grid>

        {/* --- GRAPHIQUES --- */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            {/* Bar Chart */}
            <Grid item xs={12} md={7}>
              <PremiumCard sx={{ height: '100%' }}>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AssessmentTwoTone color="primary" />
                      <Typography variant="h3" fontWeight={700}>
                        Dossiers Traités par Type et par Mois
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Box height={300} position="relative">
                    <Bar 
                      data={barChartData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { labels: { color: theme.palette.text.primary, font: { family: 'Inter' } } }
                        },
                        scales: {
                          x: { grid: { display: false }, ticks: { color: theme.palette.text.secondary } },
                          y: { grid: { color: theme.palette.divider }, ticks: { color: theme.palette.text.secondary } }
                        }
                      }} 
                    />
                  </Box>
                </CardContent>
              </PremiumCard>
            </Grid>

            {/* Pie Chart */}
            <Grid item xs={12} md={5}>
              <PremiumCard sx={{ height: '100%' }}>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <WarningTwoTone color="error" />
                      <Typography variant="h3" fontWeight={700}>
                        Causes et Facteurs de Retards
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Box height={300} display="flex" justifyContent="center" alignItems="center" position="relative">
                    <Pie 
                      data={pieChartData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { color: theme.palette.text.primary, font: { family: 'Inter' } } }
                        }
                      }} 
                    />
                  </Box>
                </CardContent>
              </PremiumCard>
            </Grid>

            {/* Line Chart */}
            <Grid item xs={12}>
              <PremiumCard>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <TrendingUpIcon color="primary" />
                      <Typography variant="h3" fontWeight={700}>
                        Tendance et Évolution des Délais Moyens (Hebdomadaire)
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Box height={260} position="relative">
                    <Line 
                      data={lineChartData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          x: { grid: { color: theme.palette.divider }, ticks: { color: theme.palette.text.secondary } },
                          y: { grid: { color: theme.palette.divider }, ticks: { color: theme.palette.text.secondary } }
                        }
                      }} 
                    />
                  </Box>
                </CardContent>
              </PremiumCard>
            </Grid>
          </Grid>
        </Grid>

        {/* --- TABLEAU DES DOSSIERS EN RETARD --- */}
        <Grid item xs={12}>
          <PremiumCard>
            <CardHeader
              title={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <WarningTwoTone color="error" />
                    <Typography variant="h3" fontWeight={700}>
                      Dossiers Dépassant le Délai Limite (SLA Actif)
                    </Typography>
                  </Box>
                  <Chip
                    label={`${dashboardData.late_dossiers_table?.length || 0} Dossiers Hors Seuil`}
                    color="error"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {dashboardData.late_dossiers_table?.length === 0 ? (
                <Box py={5} textAlign="center">
                  <CheckCircleTwoTone color="success" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    Aucun dossier en retard !
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Félicitations à toute l'équipe de transit pour le respect des SLA. 🎉
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
                      <TableRow>
                        <TableCell sx={{ pl: 3, fontWeight: 700 }}>N° Dossier</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Statut Actuel</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Date Dépôt / Création</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Agent Responsable</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">Jours de Retard</TableCell>
                        <TableCell sx={{ pr: 3, fontWeight: 700 }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.late_dossiers_table?.map((row) => (
                        <TableRow key={`${row.type}-${row.id}`} hover>
                          <TableCell sx={{ pl: 3, fontWeight: 'bold' }}>{row.numero}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.type}
                              size="small"
                              color={row.type === 'BEX' ? 'primary' : row.type === 'ADI' ? 'success' : 'warning'}
                              sx={{ fontWeight: 600, borderRadius: '4px' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label={row.statut} size="small" variant="outlined" color="error" sx={{ fontWeight: 600 }} />
                          </TableCell>
                          <TableCell>{row.date_depot_creation}</TableCell>
                          <TableCell>{row.agent_responsable || 'Non assigné'}</TableCell>
                          <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold' }} align="center">
                            +{row.jours_retard} jours
                          </TableCell>
                          <TableCell sx={{ pr: 3 }} align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              color="secondary"
                              endIcon={<LaunchTwoTone />}
                              onClick={() => navigate(`/transit/${row.type.toLowerCase()}/${row.id}`)}
                              sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 600 }}
                            >
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </PremiumCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
