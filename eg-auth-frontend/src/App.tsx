import { Box } from "@mui/material";
import { useRoutes } from "react-router-dom";
import routes from "./routes";

const App= () => {
  const element = useRoutes(routes);
  return <Box>{element}</Box>;
};

export default App;
