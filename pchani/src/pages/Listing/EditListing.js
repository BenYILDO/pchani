import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useListing } from '../../context/ListingContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AddPhotoAlternate,
  Delete,
  Save,
  ArrowBack,
} from '@mui/icons-material';

const categories = [
  { id: 1, name: 'Masaüstü Bilgisayarlar' },
  { id: 2, name: 'Dizüstü Bilgisayarlar' },
  { id: 3, name: 'İşlemciler' },
  { id: 4, name: 'Ekran Kartları' },
  { id: 5, name: 'Anakartlar' },
  { id: 6, name: 'RAM' },
  { id: 7, name: 'Depolama' },
  { id: 8, name: 'Monitörler' },
  { id: 9, name: 'Klavye & Mouse' },
];

const cities = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Konya',
  'Gaziantep',
];

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getListing, updateListing } = useListing();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    condition: 'used',
    city: '',
    district: '',
    images: [],
    contactPhone: '',
    contactEmail: '',
    deliveryType: 'both',
  });

  useEffect(() => {
    const listing = getListing(parseInt(id));
    if (listing) {
      if (listing.userId !== user.id) {
        // Kullanıcı bu ilanın sahibi değilse profile yönlendir
        navigate('/profile');
        return;
      }
      setFormData(listing);
    } else {
      // İlan bulunamadıysa profile yönlendir
      navigate('/profile');
    }
  }, [id, user.id, getListing, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages].slice(0, 8) // Maximum 8 images
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateListing(id, formData);
      
      setSnackbar({
        open: true,
        message: 'İlan başarıyla güncellendi!',
        severity: 'success',
      });

      // Kısa bir süre sonra profile yönlendir
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'İlan güncellenirken bir hata oluştu!',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/profile')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">
            İlanı Düzenle
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Kategori"
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="İlan Başlığı"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fiyat"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ürün Durumu</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  label="Ürün Durumu"
                >
                  <MenuItem value="new">Yeni</MenuItem>
                  <MenuItem value="used">Kullanılmış</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Fotoğraflar
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddPhotoAlternate />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Fotoğraf Ekle (Max 8)
                </Button>
              </label>
              <Grid container spacing={2}>
                {formData.images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '100%',
                        '&:hover .delete-button': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={typeof image === 'string' ? image : image.preview}
                        alt={`Preview ${index + 1}`}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                      <IconButton
                        className="delete-button"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <Delete sx={{ color: 'white' }} />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Şehir</InputLabel>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  label="Şehir"
                  required
                >
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="İlçe"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="E-posta"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                type="email"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Teslimat Türü</InputLabel>
                <Select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                  label="Teslimat Türü"
                >
                  <MenuItem value="shipping">Sadece Kargo</MenuItem>
                  <MenuItem value="pickup">Sadece Elden Teslim</MenuItem>
                  <MenuItem value="both">Her İkisi de</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                >
                  Değişiklikleri Kaydet
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EditListing; 