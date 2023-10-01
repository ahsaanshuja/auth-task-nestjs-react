import {
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";

import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userLogin } from "../API/auth";
import { ErrorResponse, LoginUserType } from "../utils/types";
import { useCookies } from "react-cookie";
import { setAuth } from "../API";
import { AxiosError } from "axios";

const Login: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserType>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const history = useNavigate();
  const [_, setCookie] = useCookies(["user"]);
  const { mutate, isLoading } = useMutation(userLogin, {
    onSuccess: ({ data }) => {
      const user = {
        ...data,
      };
      setCookie("user", JSON.stringify(user), { path: "/" });
      setAuth();
      history("/application");
    },
    onError: (error: AxiosError) => {
      const errorData = error.response?.data as ErrorResponse;
      toast.error(errorData?.message || "Something went wrong");
      console.log("error", error);
    },
  });

  const onSubmit = (data: LoginUserType) => {
    if (data) {
      mutate({ ...data });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        mt={9}
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
        flexDirection="column"
      >
        <Fab color="primary" aria-label="lock">
          <LockIcon />
        </Fab>
        <Typography fontSize={20}>Login</Typography>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("email", { required: "Email is required." })}
            error={Boolean(errors.email)}
            fullWidth
            autoFocus
            label="Email"
            type="email"
            variant="outlined"
            required
            margin="normal"
            helperText={
              Boolean(errors.email)
                ? errors.email?.message?.toString()
                : undefined
            }
          />
          <TextField
            margin="normal"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={Boolean(errors.password)}
            fullWidth
            required
            label="Password"
            type={isVisible ? "text" : "password"}
            variant="outlined"
            helperText={
              Boolean(errors.password)
                ? errors.password?.message?.toString()
                : undefined
            }
            inputProps={{
              autoComplete: "off",
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    setIsVisible(!isVisible);
                  }}
                >
                  {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              ),
            }}
          />

          <Button
            disabled={isLoading}
            sx={{
              mt: 2,
            }}
            type="submit"
            fullWidth
            variant="contained"
          >
            {isLoading ? "signing in..." : "Sign in"}
          </Button>
        </form>

        <Box mt={2}>
          <Link to="/signUp">Don't have an account? Sign Up</Link>
        </Box>
      </Box>
    </Container>
  );
};
export default Login;
