import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import { useListing } from '../../context/ListingContext';
import ProductCard from '../../components/ProductCard';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

const sortOptions = [
  { value: 'date_desc', label: 'Eklenme Tarihi (Yeni)' },
  { value: 'date_asc', label: 'Eklenme Tarihi (Eski)' },
  { value: 'price_desc', label: 'Fiyat (Pahalı)' },
  { value: 'price_asc', label: 'Fiyat (Ucuz)' },
  { value: 'title_asc', label: 'İsim (A-Z)' },
  { value: 'title_desc', label: 'İsim (Z-A)' },
];

const Favorites = () => {
  const theme = useTheme();
  const { favoriteLists, createFavoriteList, getListItems } = useListing();
  const [selectedList, setSelectedList] = useState('default');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateList = async () => {
    if (newListName.trim()) {
      const newList = await createFavoriteList(newListName.trim());
      setNewListName('');
      setShowCreateDialog(false);
      setSelectedList(newList.id);
    }
  };

  // Listedeki ürünleri filtrele ve sırala
  const getFilteredAndSortedItems = () => {
    let items = getListItems(selectedList);

    // Arama filtrelemesi
    if (searchQuery) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.listingNumber.includes(searchQuery)
      );
    }

    // Sıralama
    return items.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_desc':
          return b.price - a.price;
        case 'price_asc':
          return a.price - b.price;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };

  const filteredItems = getFilteredAndSortedItems();

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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Favori Listelerim
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateDialog(true)}
          >
            Yeni Liste Oluştur
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedList}
            onChange={(e, newValue) => setSelectedList(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {favoriteLists.map((list) => (
              <Tab
                key={list.id}
                label={`${list.name} (${list.items.length})`}
                value={list.id}
              />
            ))}
          </Tabs>
        </Box>

        {/* Filtreleme Araçları */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 3 }}
          alignItems="center"
        >
          <TextField
            size="small"
            placeholder="Liste içinde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: <FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sırala</InputLabel>
            <Select
              value={sortBy}
              label="Sırala"
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {filteredItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Bu listede henüz ürün bulunmuyor.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredItems.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <ProductCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Yeni Liste Oluşturma Dialog'u */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Yeni Favori Listesi Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Liste Adı"
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>İptal</Button>
          <Button
            onClick={handleCreateList}
            variant="contained"
            disabled={!newListName.trim()}
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Favorites; 