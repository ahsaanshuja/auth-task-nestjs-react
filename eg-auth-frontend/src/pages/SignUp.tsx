import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Fab,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuth } from "../API";
import { signUpUser } from "../API/auth";
import { ErrorResponse, SignUpType } from "../utils/types";
import { AxiosError } from "axios";

const SignUp: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpType>();

  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isLetterValid, setIsLetterValid] = useState(false);
  const [isNumberValid, setIsNumberValid] = useState(false);
  const [isSpecialCharValid, setIsSpecialCharValid] = useState(false);

  const passwordValue = watch("password");

  useEffect(() => {
    setIsLengthValid(passwordValue?.length >= 8);
    setIsLetterValid(/[a-zA-Z]/.test(passwordValue));
    setIsNumberValid(/\d/.test(passwordValue));
    setIsSpecialCharValid(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordValue)
    );
  }, [passwordValue]);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const history = useNavigate();
  const [_, setCookie] = useCookies(["user"]);
  const { mutate, isLoading } = useMutation(signUpUser, {
    onSuccess: ({ data }) => {
      const user = {
        ...data,
      };
      setCookie("user", JSON.stringify(user), { path: "/" });
      setAuth();
      history("/application");
      toast.success("Account Created Successfully");
    },
    onError: (error: AxiosError) => {
      const errorData = error.response?.data as ErrorResponse;
      toast.error(errorData?.message || "Something went wrong");
      console.log("error", error);
    },
  });

  const handleSignUp = (data: SignUpType) => {
    mutate({
      username: data.username,
      email: data.email,
      password: data.password,
    });
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
        <Typography fontSize={20}>Sign Up</Typography>
        <form noValidate onSubmit={handleSubmit(handleSignUp)}>
          <TextField
            {...register("username", { required: "Name is required." })}
            error={Boolean(errors.username)}
            fullWidth
            label="name"
            type="text"
            variant="outlined"
            required
            autoFocus
            margin="normal"
            helperText={
              Boolean(errors.username)
                ? errors.username?.message?.toString()
                : undefined
            }
          />
          <TextField
            {...register("email", { required: "Email is required." })}
            error={Boolean(errors.email)}
            fullWidth
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
              pattern: {
                value:
                  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password must meet all requirements",
              },
            })}
            error={Boolean(errors.password)}
            fullWidth
            required
            label="Password"
            type={isVisible ? "text" : "password"}
            variant="outlined"
            inputProps={{
              autoComplete: "off",
            }}
            helperText={
              Boolean(errors.password)
                ? errors.password?.message?.toString()
                : undefined
            }
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
          <FormControlLabel
            control={<Checkbox size="small" checked={isLengthValid} />}
            label="Minimum length of 8 characters"
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={isLetterValid} />}
            label="Contains at least 1 letter"
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={isNumberValid} />}
            label="Contains at least 1 number"
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={isSpecialCharValid} />}
            label="Contains at least 1 special character"
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
            {isLoading ? "signing up ..." : "Sign up"}
          </Button>
        </form>

        <Box mt={2}>
          <Link to="/login">Already have an account? Login</Link>
        </Box>
      </Box>
    </Container>
  );
};
export default SignUp;
