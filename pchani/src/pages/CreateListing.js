import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListing } from '../context/ListingContext';
import { categories, cities, deliveryTypes, conditions } from '../constants';
// ... rest of imports ...

function CreateListing() {
  // ... existing state and hooks ...

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Yeni İlan Oluştur
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* ... existing form fields ... */}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Şehir</InputLabel>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
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
              <FormControl fullWidth>
                <InputLabel>Ürün Durumu</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(conditions).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Teslimat Şekli</InputLabel>
                <Select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(deliveryTypes).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* ... rest of form fields ... */}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateListing; 