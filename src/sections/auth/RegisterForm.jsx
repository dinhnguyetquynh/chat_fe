import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../../services/localStorageService.js';
import userService from '../../services/userService.js';
import { notification } from 'antd';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
  });

  const defaultValues = {
    phoneNumber: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const handleClick = (data) => {
    setLoading(true);
    userService
      .getUserInfoByPhoneNumber(data.phoneNumber)
      .then(() => {
        notification.info({ message: 'Số điện thoại đã được đăng ký' });
      })
      .catch(() => {
        localStorageService.setValue('phoneNumber', data.phoneNumber);
        localStorageService.setValue('password', data.password);
        navigate('/auth/verify');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleClick)}>
      <Stack spacing={3} mb={4}>
        <RHFTextField name="phoneNumber" label="Phone number" />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <div id="recaptcha-container"></div>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) =>
            theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) =>
              theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
          },
        }}
      >
        Create Account
      </LoadingButton>
    </FormProvider>
  );
}
