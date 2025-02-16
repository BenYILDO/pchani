import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Checkbox,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useListing } from '../context/ListingContext';

const FavoriteListDialog = ({ open, onClose, listingId }) => {
  const {
    favoriteLists,
    createFavoriteList,
    toggleListItem,
    deleteFavoriteList,
    updateListName,
  } = useListing();

  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateList = async () => {
    if (newListName.trim()) {
      await createFavoriteList(newListName.trim());
      setNewListName('');
    }
  };

  const handleToggleListItem = async (listId) => {
    await toggleListItem(listId, listingId);
  };

  const handleDeleteList = async (listId) => {
    await deleteFavoriteList(listId);
  };

  const handleStartEdit = (list) => {
    setEditingList(list);
    setEditName(list.name);
  };

  const handleSaveEdit = async () => {
    if (editName.trim() && editingList) {
      await updateListName(editingList.id, editName.trim());
      setEditingList(null);
    }
  };

  const isInList = (list) => {
    return list.items.includes(listingId);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <FavoriteIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">Favori Listelerine Ekle</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Yeni Liste Oluşturma */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Yeni liste adı"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateList}
            disabled={!newListName.trim()}
          >
            Oluştur
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Mevcut Listeler */}
        <List>
          {favoriteLists.map((list) => (
            <ListItem key={list.id}>
              {editingList?.id === list.id ? (
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <Button onClick={handleSaveEdit}>Kaydet</Button>
                  <Button onClick={() => setEditingList(null)}>İptal</Button>
                </Box>
              ) : (
                <>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isInList(list)}
                      onChange={() => handleToggleListItem(list.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={list.name}
                    secondary={`${list.items.length} ürün`}
                  />
                  <ListItemSecondaryAction>
                    {list.id !== 'default' && (
                      <>
                        <IconButton
                          edge="end"
                          onClick={() => handleStartEdit(list)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteList(list.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FavoriteListDialog; 