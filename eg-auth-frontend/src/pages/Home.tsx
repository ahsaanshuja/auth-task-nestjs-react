import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();
  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Easy Generator
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                removeCookie("user");
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Box mt={4}>
        <Typography variant="h3" component="h3">
          Welcome to the application.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
