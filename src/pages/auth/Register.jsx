import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Typography, Link } from '@mui/material';

import RegisterForm from '../../sections/auth/RegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Register</Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link component={RouterLink} to={'/auth/login'} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>
      {/* Form */}
      <RegisterForm />

      <Typography
        component="div"
        sx={{
          color: 'text.secondary',
          mt: 3,
          typography: 'caption',
          textAlign: 'center',
        }}
      ></Typography>
    </>
  );
}
