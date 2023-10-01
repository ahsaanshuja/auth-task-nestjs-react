import axios from "..";
import { LoginUserType, SignUpType } from "../../utils/types";

export const userLogin = async (data: LoginUserType) => {
  return await axios.post("auth/login", data);
};

export const signUpUser = async (data: SignUpType) => {
  return await axios.post("auth/signup", data);
};
