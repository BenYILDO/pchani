import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Chip,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useListing } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';

const MyListings = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { getUserListings, updateListingStatus, deleteListing, searchListings } = useListing();
  const [selectedTab, setSelectedTab] = useState('active');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const userListings = getUserListings(user?.id);
  const filteredListings = userListings.filter(listing => {
    const matchesStatus = 
      selectedTab === 'active' ? listing.status === 'active' :
      selectedTab === 'passive' ? listing.status === 'passive' :
      selectedTab === 'sold' ? listing.status === 'sold' :
      true;

    const matchesSearch = searchQuery ? (
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.listingNumber === searchQuery
    ) : true;

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'passive': return 'warning';
      case 'sold': return 'primary';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Yayında';
      case 'passive': return 'Pasif';
      case 'sold': return 'Satıldı';
      default: return status;
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await updateListingStatus(listingId, newStatus);
    } catch (error) {
      console.error('İlan durumu güncellenirken hata oluştu:', error);
    }
  };

  const handleDeleteClick = (listing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedListing) {
      try {
        await deleteListing(selectedListing.id);
        setDeleteDialogOpen(false);
        setSelectedListing(null);
      } catch (error) {
        console.error('İlan silinirken hata oluştu:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        sx={{ 
          p: 3,
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        {/* Üst Başlık ve Arama */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            İlanlarım
          </Typography>
          <TextField
            size="small"
            placeholder="İlan no veya kelime ile ara"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/post-listing"
          >
            Yeni İlan Ver
          </Button>
        </Box>

        {/* Özet Bilgiler */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.success.main, 0.1),
              }}
            >
              <Typography variant="h6" color="success.main">
                {userListings.filter(l => l.status === 'active').length}
              </Typography>
              <Typography color="text.secondary">Yayında</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
              }}
            >
              <Typography variant="h6" color="warning.main">
                {userListings.filter(l => l.status === 'passive').length}
              </Typography>
              <Typography color="text.secondary">Pasif</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Typography variant="h6" color="primary.main">
                {userListings.filter(l => l.status === 'sold').length}
              </Typography>
              <Typography color="text.secondary">Satıldı</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Sekmeler */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Yayında Olanlar" value="active" />
            <Tab label="Yayında Olmayanlar" value="passive" />
            <Tab label="Satılanlar" value="sold" />
          </Tabs>
        </Box>

        {/* İlan Listesi */}
        {filteredListings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Bu kategoride ilan bulunmuyor.
            </Typography>
          </Box>
        ) : (
          <Box>
            {filteredListings.map((listing) => (
              <Paper
                key={listing.id}
                sx={{
                  p: 2,
                  mb: 2,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.05),
                  }
                }}
              >
                <Grid container spacing={2}>
                  {/* İlan Resmi */}
                  <Grid item xs={12} sm={3}>
                    <Box
                      component="img"
                      src={listing.image}
                      alt={listing.title}
                      sx={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  </Grid>

                  {/* İlan Detayları */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom component={Link} to={`/product/${listing.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                        {listing.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Chip
                          label={getStatusText(listing.status)}
                          color={getStatusColor(listing.status)}
                          size="small"
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <VisibilityIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2">{listing.views || 0}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          İlan No: {listing.listingNumber}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                        <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">{listing.city}, {listing.district}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">İlan Tarihi: {listing.createdAt}</Typography>
                      </Box>

                      <Typography variant="h6" color="primary" sx={{ mt: 'auto' }}>
                        {listing.price.toLocaleString()} TL
                      </Typography>
                    </Box>
                  </Grid>

                  {/* İşlem Butonları */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        size="small"
                        component={Link}
                        to={`/edit-listing/${listing.id}`}
                        fullWidth
                      >
                        Düzenle
                      </Button>
                      {listing.status === 'active' ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleStatusChange(listing.id, 'passive')}
                          fullWidth
                        >
                          Yayından Kaldır
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleStatusChange(listing.id, 'active')}
                          fullWidth
                        >
                          Yayına Al
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(listing)}
                        fullWidth
                      >
                        Sil
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      {/* Silme Onay Dialog'u */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>İlanı Sil</DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedListing?.title}" başlıklı ilanı silmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyListings; 