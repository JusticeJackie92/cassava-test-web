import ExternalLink from '@/components/external-link';
import { OAuthButtonGroup } from '@/components/OAuthButtonGroup';
import PageLayout from '@/components/page-layout';
import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";
import NextImage from 'next/image';
import { Trans, useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';
import { ImSphere } from 'react-icons/im';
import { FaUserAlt, FaLock } from "react-icons/fa";
import ReactiveButton from 'reactive-button';
import { toast } from 'react-toastify';
import axios from 'axios';
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const CustomImage = chakra(NextImage, {
  baseStyle: {
    borderRadius: 'lg',
    boxShadow: 'lg',
  },
  shouldForwardProp: (prop) =>
    ['src', 'alt', 'width', 'height'].includes(prop),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('' as any)
  const [password, setPassword]= useState('' as any)
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors]= useState({})
  const [emailErrors, setEmailError] = useState('')
  const [state, setState]= useState('idle')
  const [loginPage, setLoginPage]= useState(true)

  const handleShowClick = () => setShowPassword(!showPassword);
  const emailValidation = () => {
    const validEmail =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if(validEmail.test(email)){
    //setMessage("Email is Valid")
  
    setEmailError("")
  
  }else if(!validEmail.test(email) && email === " ") {
     setFormErrors("Enter valid Email");
  
  
  
  }else {
    setEmailError("Email is not valid")
    setFormErrors("")
  }
  }


  const loginProfile = () => {
    if (email.length <= 5 || password.length <= 0 ) {
      toast.info('Kindly Enter valid Credentials')
    
    }

    else {
      setLoading(true)

      setState('loading')
      const SendOptions = {
        url: '/api/login',
        method: "POST",
      };

      axios.post(SendOptions.url,
        {
          email: email,
          password: password,
  

        }).then((response) => {
          setLoading(false)
  
          if (response.data.success == true) {
            console.log(response.data);
            toast.success("Login SuccessFull")
            setState('idle')
            setLoginPage(false)
          }

          else {

            toast.error(response.data.message)

          }

        })
        .catch((err) => {
          const _errorMessage = err?.response?.data?.message || "an error while executing your request"
          setLoading(false)
          toast.error(_errorMessage)
          setState('idle')

        });

    }

  }

  const handleEmailChange = (e: any) => {
    emailValidation()
    setEmail(e.target.value)
    delete formErrors["email"];
    setFormErrors("Enter valid Email");
  }
 
  const handlePassword = (e: any) => {
    setPassword(e.target.value)
    delete formErrors["password"];
    setFormErrors("Enter valid password");
  }
 


  const handleOnBlur = (e: any, formField: any) => {

    if (!e.target.value == null || (e.target.value + "").length < 1) {
      let oldFormErrors = { ...formErrors };
      oldFormErrors[formField] = formField.replace(/_/, " ") + " is required ";
      setFormErrors(oldFormErrors);
      return;
    }
  };



  return (
    <PageLayout
      title='Home'
      >

      <Stack
        flexDir="column"
        mb="2"
        marginTop={100}
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="#ff147d" />
        <Heading color="#ff147d">Welcome</Heading>


   
        <Heading fontSize={16} color="#343434">Login your account</Heading>
        <Box borderRadius={10} minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
                      <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    // eslint-disable-next-line react/no-children-prop
                    children={<CFaUserAlt color="black" />}
                  />
                  <Input style={
                    formErrors["email"] ? { border: "1px solid red" } : {}
                  } onBlur={(e) => handleOnBlur(e, "email")} type="email" placeholder="Email address" onChange={handleEmailChange} required />
                </InputGroup>
              </FormControl>

   <Box style={{color: 'red'}}>{emailErrors} </Box>



              <FormControl>
                <InputGroup  style={
                    formErrors["password"] ? { border: "1px solid red" } : {} }>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    // eslint-disable-next-line react/no-children-prop
                    children={<CFaLock color="black" />}
                  />
                  <Input onClick={handlePassword}  onBlur={(e) => handleOnBlur(e, "password")} 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                 
                </FormHelperText>
              </FormControl>
              <ReactiveButton
      buttonState={state}
      disabled={emailErrors === 'Email is not valid' ? true : false}
      idleText="Submit"
      loadingText="Loading"
    
    style={{backgroundColor: '#ff147d'}}
      successText="Done"
      onClick={loginProfile}
    />
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color="#ff147d" href="/">
          Sign Up
        </Link>
      </Box>
      

 
 

    </PageLayout>
  );
};

export default Login;
