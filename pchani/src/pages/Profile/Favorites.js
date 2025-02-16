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
} from '@mui/material';
import { useListing } from '../../context/ListingContext';
import ProductCard from '../../components/ProductCard';
import AddIcon from '@mui/icons-material/Add';

const Favorites = () => {
  const theme = useTheme();
  const { favoriteLists, createFavoriteList, getListItems } = useListing();
  const [selectedList, setSelectedList] = useState('default');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = async () => {
    if (newListName.trim()) {
      const newList = await createFavoriteList(newListName.trim());
      setNewListName('');
      setShowCreateDialog(false);
      setSelectedList(newList.id);
    }
  };

  const currentListItems = getListItems(selectedList);

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

        {currentListItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Bu listede henüz ürün bulunmuyor.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {currentListItems.map((listing) => (
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