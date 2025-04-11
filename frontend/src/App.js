import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, FormControl, InputLabel, Select, MenuItem,
  Box, Typography, Grid, Card, CardContent, Button, useMediaQuery,
  CircularProgress, Snackbar, Alert, IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: '',
    order: 'asc',
    active: '',
    course: '',
    age: '',
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#f0f2f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      primary: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            '&.gradient': {
              background: `linear-gradient(145deg, 
                ${darkMode ? '#1e1e1e' : '#ffffff'} 0%, 
                ${darkMode ? '#2d2d2d' : '#f8f9fa'} 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: `linear-gradient(145deg, 
              ${darkMode ? '#1e1e1e' : '#ffffff'} 0%, 
              ${darkMode ? '#2d2d2d' : '#f8f9fa'} 100%)`,
          },
        },
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:8000/api/students?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setStudents(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching students');
    } finally {
      setIsLoading(false);
    }
  };

  const courseData = students.reduce((acc, student) => {
    acc[student.Course] = (acc[student.Course] || 0) + 1;
    return acc;
  }, {});

  const activeData = students.reduce((acc, student) => {
    acc[student.active ? 'Active' : 'Inactive'] = (acc[student.active ? 'Active' : 'Inactive'] || 0) + 1;
    return acc;
  }, {});

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.active).length,
    averageAge: students.reduce((acc, s) => acc + s.age, 0) / students.length || 0
  };

  const COLORS = ['#2196f3', '#f50057', '#ffeb3b', '#4caf50'];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: theme.palette.background.default, 
        minHeight: '100vh',
        width: '100%',
        py: 3,
        boxSizing: 'border-box'
      }}>
        <IconButton 
          onClick={() => setDarkMode(!darkMode)}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1100,
            bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            }
          }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SchoolIcon sx={{ 
              fontSize: 60, 
              mb: 2,
              color: theme.palette.primary.main 
            }} />
            <Typography
              variant="h3"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                mb: 1
              }}
            >
              Student Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.secondary }}
            >
              Manage and analyze student data efficiently
            </Typography>
          </Box>

          <Paper 
            className="gradient"
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2,
              boxShadow: theme.shadows[3]
            }}
          >
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2, 
                  alignItems: isMobile ? 'stretch' : 'center' 
                }}>
                  <TextField
                    label="JWT Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    size="small"
                    fullWidth={isMobile}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                  <Button 
                    variant="contained"
                    onClick={getStudents}
                    disabled={!token || isLoading}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      color: 'white',
                      minWidth: 120,
                    }}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isLoading ? 'Loading...' : 'Get Students'}
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2 
                }}>
                  {['sort', 'order', 'active'].map((filterType) => (
                    <FormControl 
                      key={filterType} 
                      size="small" 
                      fullWidth={isMobile}
                      sx={{ minWidth: 120 }}
                    >
                      <InputLabel>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</InputLabel>
                      <Select
                        value={filters[filterType]}
                        label={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        onChange={(e) => setFilters({...filters, [filterType]: e.target.value})}
                      >
                        {filterType === 'sort' && [
                          <MenuItem value="">None</MenuItem>,
                          <MenuItem value="name">Name</MenuItem>,
                          <MenuItem value="age">Age</MenuItem>,
                          <MenuItem value="course">Course</MenuItem>
                        ]}
                        {filterType === 'order' && [
                          <MenuItem value="asc">Ascending</MenuItem>,
                          <MenuItem value="desc">Descending</MenuItem>
                        ]}
                        {filterType === 'active' && [
                          <MenuItem value="">All</MenuItem>,
                          <MenuItem value="true">Active</MenuItem>,
                          <MenuItem value="false">Inactive</MenuItem>
                        ]}
                      </Select>
                    </FormControl>
                  ))}
                  <TextField
                    label="Max Age"
                    type="number"
                    size="small"
                    fullWidth={isMobile}
                    value={filters.age}
                    onChange={(e) => setFilters({...filters, age: e.target.value})}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {Object.entries(stats).map(([key, value]) => (
                <Grid item xs={12} sm={4} key={key}>
                  <Card 
                    sx={{ 
                      p: 2,
                      boxShadow: theme.shadows[2],
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                        {typeof value === 'number' ? value.toFixed(1) : value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom>Students per Course</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(courseData).map(([name, value]) => ({ name, value }))}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom>Active vs Inactive Students</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(activeData).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill={theme.palette.primary.main}
                        dataKey="value"
                      >
                        {Object.entries(activeData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Typography variant="h6" gutterBottom>Student List</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      {!isMobile && <TableCell>Age</TableCell>}
                      {!isTablet && <TableCell>Course</TableCell>}
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow 
                        key={student._id}
                        sx={{
                          '&:hover': {
                            bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          }
                        }}
                      >
                        <TableCell>{student._id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        {!isMobile && <TableCell>{student.age}</TableCell>}
                        {!isTablet && <TableCell>{student.Course}</TableCell>}
                        <TableCell>
                          <Box
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: 'inline-block',
                              bgcolor: student.active ? 'success.main' : 'error.main',
                              color: 'white',
                            }}
                          >
                            {student.active ? 'Active' : 'Inactive'}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Paper>
        </Container>
      </Box>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;