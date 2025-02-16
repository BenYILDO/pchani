import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Stepper,
  Step,
  StepLabel,
  IconButton,
} from '@mui/material';
import {
  AddPhotoAlternate,
  Delete,
  NavigateNext,
  NavigateBefore,
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

const steps = ['Kategori Seçimi', 'Ürün Detayları', 'Fotoğraflar', 'İletişim Bilgileri'];

function CreateListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addListing } = useListing();
  const [activeStep, setActiveStep] = useState(0);
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const listingData = {
        ...formData,
        userId: user.id,
        contactPhone: user.phone,
        contactEmail: user.email
      };

      await addListing(listingData);
      navigate('/profile');
    } catch (error) {
      console.error('İlan oluşturulurken hata oluştu:', error);
      // TODO: Kullanıcıya hata mesajı göster
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
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
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="İlan Başlığı"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Açıklama"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              sx={{ mb: 2 }}
            />
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
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
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
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
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
                      src={image.preview}
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
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
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
            <TextField
              fullWidth
              label="İlçe"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Telefon"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="E-posta"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              type="email"
              sx={{ mb: 2 }}
            />
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
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Yeni İlan Oluştur
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<NavigateBefore />}
            >
              Geri
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                İlanı Yayınla
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                endIcon={<NavigateNext />}
              >
                İleri
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateListing; 