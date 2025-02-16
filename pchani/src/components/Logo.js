import React from 'react';
import { Box, Typography } from '@mui/material';
import logo from '../assets/logo.svg';

function Logo({ variant = 'full', sx = {} }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
      <Box 
        component="img"
        src={logo}
        alt="PC HANI"
        sx={{
          height: variant === 'full' ? '60px' : '40px',
          width: 'auto',
          ...sx
        }}
      />
      {variant === 'full' && (
        <Typography
          variant="subtitle2"
          sx={{
            color: '#FF3B30',
            mt: 1,
            fontWeight: 500,
          }}
        >
          Yeni gibi, yenilenmiş bilgisayarlar
        </Typography>
      )}
    </Box>
  );
}

export default Logo; 