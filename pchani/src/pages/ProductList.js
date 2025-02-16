import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useListing } from '../context/ListingContext';
import { categories, cities, deliveryTypes, conditions, sortOptions } from '../constants';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Checkbox,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DeleteIcon from '@mui/icons-material/Delete';

function ProductList() {
  const { listings, categoryStats } = useListing();
  const [searchParams] = useSearchParams();
  const [filteredListings, setFilteredListings] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [condition, setCondition] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [deliveryType, setDeliveryType] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  // URL'den parametreleri al
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const categoryId = searchParams.get('category');
    
    if (searchQuery) {
      setSearchKeyword(searchQuery);
    }
    
    if (categoryId) {
      const numericCategoryId = parseInt(categoryId, 10);
      if (!isNaN(numericCategoryId)) {
        setSelectedCategories([numericCategoryId]);
        // Kategori adını aktif filtrelere ekle
        const category = categories.find(c => c.id === numericCategoryId);
        if (category) {
          updateActiveFilters('category', category.name);
        }
      }
    }
  }, [searchParams]);

  // Filtreleri uygula
  useEffect(() => {
    console.log('Current listings:', listings); // Debug için
    console.log('Selected categories:', selectedCategories); // Debug için

    let filtered = [...listings].filter(listing => listing.status === 'active');

    // Arama filtresi
    if (searchKeyword) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Kategori filtresi
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(listing => {
        const listingCategoryId = Number(listing.category);
        return selectedCategories.some(selectedId => Number(selectedId) === listingCategoryId);
      });
    }

    // Fiyat aralığı filtresi
    filtered = filtered.filter(listing =>
      listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );

    // Şehir filtresi
    if (selectedCity) {
      filtered = filtered.filter(listing => listing.city === selectedCity);
    }

    // Durum filtresi
    if (condition !== 'all') {
      filtered = filtered.filter(listing => listing.condition === condition);
    }

    // Teslimat tipi filtresi
    if (deliveryType !== 'all') {
      filtered = filtered.filter(listing =>
        listing.deliveryType === deliveryType || listing.deliveryType === 'both'
      );
    }

    // Sıralama
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'date_desc':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'date_asc':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'popular':
            return b.views - a.views;
          default:
            return 0;
        }
      });
    }

    console.log('Filtered listings:', filtered); // Debug için

    setFilteredListings(filtered);
  }, [
    listings,
    searchKeyword,
    selectedCategories,
    priceRange,
    selectedCity,
    condition,
    deliveryType,
    sortBy,
  ]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    updateActiveFilters('price', `${newValue[0]} TL - ${newValue[1]} TL`);
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
      removeActiveFilter('category', category.name);
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
      updateActiveFilters('category', category.name);
    }
  };

  const updateActiveFilters = (type, value) => {
    setActiveFilters(prev => {
      const filtered = prev.filter(f => f.type !== type);
      return [...filtered, { type, value }];
    });
  };

  const removeActiveFilter = (type, value) => {
    setActiveFilters(prev => prev.filter(f => !(f.type === type && f.value === value)));
  };

  const clearAllFilters = () => {
    setSortBy('');
    setPriceRange([0, 50000]);
    setCondition('all');
    setOnlyVerified(false);
    setSelectedCity('');
    setDeliveryType('all');
    setSearchKeyword('');
    setSelectedCategories([]);
    setActiveFilters([]);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 3,
        height: '100%'
      }}
    >
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon sx={{ mr: 1 }} /> Filtreler
              </Typography>
              <Button
                startIcon={<DeleteIcon />}
                size="small"
                onClick={clearAllFilters}
                sx={{ textTransform: 'none' }}
              >
                Temizle
              </Button>
            </Box>

            {activeFilters.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {activeFilters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter.value}
                    onDelete={() => removeActiveFilter(filter.type, filter.value)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Kategoriler</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {categories.map((category) => (
                    <FormControlLabel
                      key={category.id}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                        />
                      }
                      label={`${category.name} (${categoryStats[category.id] || 0})`}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Sıralama</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth>
                  <Select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      const option = sortOptions.find(opt => opt.value === e.target.value);
                      if (option) {
                        updateActiveFilters('sort', option.label);
                      }
                    }}
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Fiyat Aralığı</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={50000}
                    step={100}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <TextField
                      size="small"
                      label="Min TL"
                      value={priceRange[0]}
                      type="number"
                      sx={{ width: '45%' }}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    />
                    <TextField
                      size="small"
                      label="Max TL"
                      value={priceRange[1]}
                      type="number"
                      sx={{ width: '45%' }}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Konum</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth>
                  <Select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      if (e.target.value) {
                        updateActiveFilters('location', e.target.value);
                      }
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">Tüm Şehirler</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>{city}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Teslimat</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RadioGroup
                  value={deliveryType}
                  onChange={(e) => {
                    setDeliveryType(e.target.value);
                    updateActiveFilters('delivery', e.target.value === 'shipping' ? 'Kargo ile' : 'Elden Teslim');
                  }}
                >
                  <FormControlLabel value="all" control={<Radio />} label="Tümü" />
                  <FormControlLabel value="shipping" control={<Radio />} label="Kargo ile" />
                  <FormControlLabel value="pickup" control={<Radio />} label="Elden Teslim" />
                </RadioGroup>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Ürün Durumu</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RadioGroup
                  value={condition}
                  onChange={(e) => {
                    setCondition(e.target.value);
                    updateActiveFilters('condition', e.target.value === 'new' ? 'Yeni' : 'Kullanılmış');
                  }}
                >
                  <FormControlLabel value="all" control={<Radio />} label="Tümü" />
                  <FormControlLabel value="new" control={<Radio />} label="Yeni" />
                  <FormControlLabel value="used" control={<Radio />} label="Kullanılmış" />
                </RadioGroup>
              </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={onlyVerified}
                    onChange={(e) => {
                      setOnlyVerified(e.target.checked);
                      if (e.target.checked) {
                        updateActiveFilters('verified', 'Güvenilir Satıcı');
                      } else {
                        removeActiveFilter('verified', 'Güvenilir Satıcı');
                      }
                    }}
                  />
                }
                label="Sadece Güvenilir Satıcılar"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Product List */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {filteredListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <Card
                  component={Link}
                  to={`/product/${listing.id}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={listing.image}
                    alt={listing.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                      {listing.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {listing.city} • {conditions[listing.condition]}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {listing.price.toLocaleString()} TL
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductList; 