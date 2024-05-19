import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Button } from '@mui/material';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useNavigate } from 'react-router-dom';
import {
  RecaptchaVerifier,
  auth,
  signInWithPhoneNumber,
} from '../../firebaseConfig';
import localStorageService from '../../services/localStorageService.js';
import { notification } from 'antd';
import authService from '../../services/authService.js';
import { APP_KEY } from '../../common/constant';

export default function VerifyForm() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => {
          console.log('Recaptcha verified');
          onSignInSubmit();
        },
      },
    );
  };

  const onSignInSubmit = () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    const _phoneNumber = `+84${phoneNumber.slice(1)}`;
    console.log({ _phoneNumber });
    signInWithPhoneNumber(auth, _phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        console.log('SMS sent');
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
      });
  };

  useEffect(() => {
    const phoneNumber = localStorageService.getValue('phoneNumber');
    const password = localStorageService.getValue('password');

    if (!phoneNumber || !password) {
      navigate('/auth/register');
    } else {
      setPhoneNumber(phoneNumber);
      setPassword(password);
    }
  }, []);

  useEffect(() => {
    if (phoneNumber) {
      onSignInSubmit();
    }
  }, [phoneNumber]);

  const VerifySchema = Yup.object().shape({
    otp: Yup.string()
      .required('OTP is required')
      .length(6, 'OTP must be 6 digits'),
  });

  const defaultValues = {
    otp: '',
  };

  const methods = useForm({
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onVerifyCodeSubmit = (data) => {
    if (confirmationResult) {
      confirmationResult
        .confirm(data.otp)
        .then((result) => {
          console.log('User signed in successfully:', result.user);
          authService
            .register({ phoneNumber, password })
            .then((resp) => {
              localStorageService.setValue(APP_KEY.token, resp.access_token);
              localStorageService.setValue(
                APP_KEY.refreshToken,
                resp.refresh_token,
              );

              localStorageService.deleteValue('phoneNumber');
              localStorageService.deleteValue('password');
              navigate('/conversations');
            })
            .catch((error) => {
              notification.error({ message: 'Error register:', error });
            });
        })
        .catch((error) => {
          notification.error({ message: 'Error verifying code:', error });
        });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onVerifyCodeSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="otp" label="OTP" />
        <div id="recaptcha-container"></div>
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
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
          Verify
        </Button>
      </Stack>
    </FormProvider>
  );
}
