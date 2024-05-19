import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { Button } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { ForgotPassword } from "../../redux/slices/auth";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
  // const { isLoading } = useSelector((state) => state.auth);

  // // const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { phoneNumber: "" },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    try {
      // Send API Request
      // dispatch(ForgotPassword(data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="phoneNumber" label="Phone number" />

      <LoadingButton
        loading={isLoading}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{
          mt: 3,
          bgcolor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "grey.800",
          "&:hover": {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
          },
        }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}
