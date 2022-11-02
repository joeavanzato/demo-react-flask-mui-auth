
import './App.css';
import Navbar from "./components/nav/navbar";
import Home from "./components/content/home";
import Auth from "./components/login/login"
import Demos from './components/content/demo';
import Protected from './components/login/protected'
import Logout from './components/login/logout'
import Error404 from './components/meta/404'

import "bootstrap/dist/css/bootstrap.min.css";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient()

function App() {
  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="Background">
          <div className="App">
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path='/login' element={
                  <Auth/>
                } />
                <Route path='/' element={
                  <Protected redirectTo="/login">
                    <Home/>
                  </Protected>
                } />
                <Route path='/demo' element={
                  <Protected redirectTo="/login">
                    <QueryClientProvider client={queryClient}>
                      <Demos/>
                    </QueryClientProvider>
                  </Protected>
                } />
                <Route path='/logout' element={
                  <Protected redirectTo="/login">
                    <Logout />
                  </Protected>
                } />
                <Route path='*' element={
                  <Protected redirectTo="/login">
                    <Error404/>
                  </Protected>
                } />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </ThemeProvider>
  );
}

export default App;
