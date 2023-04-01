import Layout from '@/components/layout';
import '@/internationalization/i18n';
import theme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans/700.css';
import { AppProps } from 'next/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, {useState} from 'react';
import axios from 'axios';

const App = ({ Component, pageProps }: AppProps) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const handleLogin = async (e:any) => {
    e.preventDefault();
    const res = await axios.post('/api/login', {
      email: e.target.email.value,
      password: e.target.password.value,
    });
    if (res.status === 200) {
      setLoggedIn(true);
    }
  };
  const handleLogout = async (e:any) => {
    e.preventDefault();
    const res = await axios.post('/api/logout');
    if (res.status === 200) {
      setLoggedIn(false);
    }
  };
  const handleRegister = async (e:any) => {
    e.preventDefault();
    const res = await axios.post('/api/register', {
      email: e.target.email.value,
      password: e.target.password.value,
      username: e.target.username.value,
      confirmHashPassword: e.target.value
      
    });
    if (res.status === 200) {
      setLoggedIn(true);
    }
  };
  return (
    <ChakraProvider theme={theme}>
            <ToastContainer
        className={`text-[13px] `}
        progressStyle={{color: 'white'}}
        hideProgressBar
       progressClassName='border-colors-white'
    
  
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
