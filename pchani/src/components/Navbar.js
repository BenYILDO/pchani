import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessage } from '../context/MessageContext';
import { useListing } from '../context/ListingContext';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  InputBase,
  Box,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Container,
  Stack,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import Logo from './Logo';
import LogoutIcon from '@mui/icons-material/Logout';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '400px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getUnreadCount } = useMessage();
  const { favorites } = useListing();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        borderRadius: 0,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ minHeight: '72px', px: { xs: 1, sm: 2 } }}>
          {/* Logo */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              mr: 3,
            }}
          >
            <Logo variant="small" />
          </Box>

          {/* Search Bar */}
          <Search>
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Kelime, ilan no veya mağaza adı ile ara"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </Search>

          {/* Detailed Search Button */}
          <Button 
            color="primary" 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              whiteSpace: 'nowrap',
              ml: 1,
            }}
          >
            Detaylı Arama
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            {user ? (
              <>
                <IconButton 
                  color="secondary"
                  component={Link}
                  to="/messages"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <Badge badgeContent={getUnreadCount()} color="primary">
                    <MessageIcon />
                  </Badge>
                </IconButton>

                <IconButton 
                  color="secondary"
                  component={Link}
                  to="/notifications"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <Badge badgeContent={5} color="primary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <IconButton 
                  color="secondary"
                  component={Link}
                  to="/my-favorites"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <FavoriteIcon />
                </IconButton>

                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/post-listing"
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    whiteSpace: 'nowrap',
                    px: 3,
                  }}
                >
                  İlan Ver
                </Button>

                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="secondary"
                >
                  {user.avatar ? (
                    <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
              >
                Giriş Yap
              </Button>
            )}
          </Stack>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                mt: 1,
                minWidth: 200,
              }
            }}
          >
            <MenuItem 
              component={Link} 
              to="/profile"
              onClick={handleClose}
              sx={{ py: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {user?.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                ) : (
                  <AccountCircle sx={{ mr: 1 }} />
                )}
                <Box>
                  <Box sx={{ fontWeight: 500 }}>{user?.firstName} {user?.lastName}</Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Hesabım</Box>
                </Box>
              </Box>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem 
              component={Link} 
              to="/my-listings"
              onClick={handleClose}
              sx={{ py: 1 }}
            >
              <StarIcon sx={{ mr: 1 }} />
              İlanlarım
            </MenuItem>

            <MenuItem 
              component={Link} 
              to="/my-favorites"
              onClick={handleClose}
              sx={{ py: 1 }}
            >
              <FavoriteIcon sx={{ mr: 1 }} />
              Favorilerim
            </MenuItem>

            <MenuItem 
              component={Link} 
              to="/messages"
              onClick={handleClose}
              sx={{ py: 1 }}
            >
              <Badge 
                badgeContent={getUnreadCount()} 
                color="primary"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    right: -3,
                    top: 3,
                  } 
                }}
              >
                <MessageIcon sx={{ mr: 1 }} />
              </Badge>
              Mesajlarım
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem 
              onClick={() => {
                handleClose();
                handleLogout();
              }}
              sx={{ py: 1, color: 'error.main' }}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 