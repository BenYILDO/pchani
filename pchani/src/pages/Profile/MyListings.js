import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useListing } from '../../context/ListingContext';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  LocalOffer,
  AccessTime,
  RemoveRedEye,
} from '@mui/icons-material';

// Örnek ilan verileri
const mockListings = [
  {
    id: 1,
    title: 'Gaming PC RTX 4090',
    price: 125000,
    image: 'https://source.unsplash.com/random?gaming-pc',
    status: 'active',
    views: 245,
    createdAt: '2024-02-10',
    lastModified: '2024-02-10',
  },
  {
    id: 2,
    title: 'MacBook Pro M2 Max',
    price: 82500,
    image: 'https://source.unsplash.com/random?macbook',
    status: 'active',
    views: 189,
    createdAt: '2024-02-09',
    lastModified: '2024-02-09',
  },
  {
    id: 3,
    title: 'RTX 4080 Ekran Kartı',
    price: 45000,
    image: 'https://source.unsplash.com/random?gpu',
    status: 'sold',
    views: 567,
    createdAt: '2024-02-08',
    lastModified: '2024-02-08',
  },
  {
    id: 4,
    title: 'Intel i9 13900K',
    price: 28500,
    image: 'https://source.unsplash.com/random?processor',
    status: 'inactive',
    views: 123,
    createdAt: '2024-02-07',
    lastModified: '2024-02-07',
  },
];

function MyListings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserListings, deleteListing, updateListingStatus } = useListing();
  const [listings, setListings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (user) {
      const userListings = getUserListings(user.id);
      setListings(userListings);
    }
  }, [user, getUserListings]);

  const handleMenuClick = (event, listing) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteListing(selectedListing.id);
      setListings(prevListings => 
        prevListings.filter(listing => listing.id !== selectedListing.id)
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('İlan silinirken hata oluştu:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateListingStatus(selectedListing.id, newStatus);
      setListings(prevListings =>
        prevListings.map(listing =>
          listing.id === selectedListing.id
            ? { ...listing, status: newStatus }
            : listing
        )
      );
      handleMenuClose();
    } catch (error) {
      console.error('İlan durumu güncellenirken hata oluştu:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFilteredListings = () => {
    switch (tabValue) {
      case 0: // Tümü
        return listings;
      case 1: // Aktif
        return listings.filter(listing => listing.status === 'active');
      case 2: // Satıldı
        return listings.filter(listing => listing.status === 'sold');
      case 3: // Pasif
        return listings.filter(listing => listing.status === 'inactive');
      default:
        return listings;
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { label: 'Aktif', color: 'success' },
      inactive: { label: 'Pasif', color: 'default' },
      sold: { label: 'Satıldı', color: 'primary' },
    };
    return statusConfig[status] || { label: status, color: 'default' };
  };

  const handleEdit = (listing) => {
    navigate(`/edit-listing/${listing.id}`);
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Tümü" />
          <Tab label="Aktif" />
          <Tab label="Satıldı" />
          <Tab label="Pasif" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {getFilteredListings().map((listing) => (
          <Grid item xs={12} sm={6} key={listing.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={listing.image}
                alt={listing.title}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>
                    {listing.title}
                  </Typography>
                  <IconButton onClick={(e) => handleMenuClick(e, listing)}>
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography variant="h6" color="primary" gutterBottom>
                  {listing.price.toLocaleString()} ₺
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    label={getStatusChip(listing.status).label}
                    color={getStatusChip(listing.status).color}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RemoveRedEye sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{listing.views}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{listing.createdAt}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* İlan Menüsü */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEdit(selectedListing)}>
          <Edit sx={{ mr: 1 }} /> Düzenle
        </MenuItem>
        {selectedListing?.status === 'active' ? (
          <MenuItem onClick={() => handleStatusChange('inactive')}>
            <VisibilityOff sx={{ mr: 1 }} /> Pasife Al
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleStatusChange('active')}>
            <Visibility sx={{ mr: 1 }} /> Aktife Al
          </MenuItem>
        )}
        <MenuItem onClick={() => handleStatusChange('sold')}>
          <LocalOffer sx={{ mr: 1 }} /> Satıldı Olarak İşaretle
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Sil
        </MenuItem>
      </Menu>

      {/* Silme Onay Dialog'u */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>İlanı Sil</DialogTitle>
        <DialogContent>
          <Typography>
            Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyListings; 