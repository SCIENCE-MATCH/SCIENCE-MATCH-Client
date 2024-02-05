import { ThemeProvider } from "styled-components";
import theme from "./style/theme";
import Router from "./routes/Router";
import GlobalStyle from "./style/GlobalStyle";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;
