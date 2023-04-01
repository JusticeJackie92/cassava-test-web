import ExternalLink from '@/components/external-link';
import { OAuthButtonGroup } from '@/components/OAuthButtonGroup';
import PageLayout from '@/components/page-layout';
import ReactiveButton from 'reactive-button';
import { useState, useEffect } from "react";
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
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import NextImage from 'next/image';
import { Trans, useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';
import { ImCheckmark, ImSphere } from 'react-icons/im';
import { FaUserAlt, FaLock,  } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from 'src/constants';
import Link from 'next/link';
import PasswordChecklist from "react-password-checklist"
import { AiFillEyeInvisible, AiFillEye, AiOutlineEye, AiOutlineEyeInvisible, IoCheckmark,  } from "react-icons/all";
import prisma from 'lib/prisma';

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

const IndexPage = () => {



  const [showPassword, setShowPassword] = useState(false);


  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('' as any)
  const [confirmPassword, setConfirmPassword] = useState('' as any)
  const [username, setUsername] = useState('' as any)
  const [email, setEmail] = useState('' as any)
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState('')
  const [emailError, setEmailError] = useState('')
  const [message, setMessage]= useState('')
  const handleShowClick = () => setShowPassword(!showPassword);
  const handleShowConfirmClick = () => setShowConfirmPassword(!showConfirmPassword)
  const [state, setState] = useState('idle');
  const router = useRouter();
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




  const handleEmailChange = (e: any) => {
    emailValidation()
    setEmail(e.target.value)
    delete formErrors["email"];
    setFormErrors("Enter valid Email");
  }

  const handleUsername = (e: any) => {
    setUsername(e.target.value)
    delete formErrors["username"];
    setFormErrors("Enter Valid username");
  }

  const handlePassword = (e: any) => {
    let new_pass = e.target.value;
    setPassword(new_pass);
    // regular expressions to validate password
    var lowerCase = /[a-z]/g;
    var upperCase = /[A-Z]/g;
    var numbers = /[0-9]/g;
    if (!new_pass.match(lowerCase)) {
       setErrorMessage("Password should contains lowercase letters!");
    } else if (!new_pass.match(upperCase)) {
       setErrorMessage("Password should contain uppercase letters!");
    } else if (!new_pass.match(numbers)) {
       setErrorMessage("Password should contains numbers also!");
    } else if (new_pass.length < 5) {
       setErrorMessage("Password length should be more than 5.");
    }  else if (new_pass.length !== confirmPassword) {
      setErrorMessage("Password does not match");
   }
  
     else {
       setErrorMessage(""); 
    }
    
    setPassword(e.target.value)
    delete formErrors["password"];
    setFormErrors("Enter Valid password");
  }
  const handleConfirmPassword = (e: any) => {
     if(password == confirmPassword){
      setErrorMessage('')
    }
    setConfirmPassword(e.target.value)
    delete formErrors["confirmpassword"];

  
    setFormErrors("Enter Valid Confirm Password");

  }



  const handleOnBlur = (e: any, formField: any) => {

    if (!e.target.value == null || (e.target.value + "").length < 1) {
      let oldFormErrors = { ...formErrors };
      oldFormErrors[formField] = formField.replace(/_/, " ") + " is required ";
      setFormErrors(oldFormErrors);
      return;
    }

    if (password == confirmPassword) {
      setErrorMessage('')
    }
  };


  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, username, confirmHashPassword: confirmPassword })
    })
    const data = await res.json()
    if (data.success) {
      // Registration successful
      // Redirect to the dashboard or login page
    } else {
      // Registration failed
      // Show an error message
    }
  }



  const registerProfile = () => {
    if (email.length <= 4 || password <= 0 || username.length <= 0 || confirmPassword <=0 ) {
      toast.info('Kindly Enter valid Credentials')
    
    }

    else {
      setLoading(true)

      const SendOptions = {
        url: '/api/register',
        method: "POST",
      };

      axios.post(SendOptions.url,
        {

          email: email,
          password: password,
          username: username,
          confirmHashPassword: password

        }).then((response) => {
          setLoading(false)
          console.log(response);
          if (response.data.success == true) {
            console.log(response.data.message);
            toast.success("Registration Successfull")
            router.push('/Login');

          }


          else {

            toast.error(response.data.message)

          }

        })
        .catch((err) => {
          const _errorMessage = err?.response?.data?.message || "an error while executing your request"
          setLoading(false)
          toast.error(_errorMessage)


        });

    }

  }


 






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

        <Heading fontSize={16} color="#343434">Create an account</Heading>
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

              <Box style = {{ color: "red" }}> {emailError} </Box>
              </FormControl>




              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    // eslint-disable-next-line react/no-children-prop
                    children={<CFaUserAlt color="black" />}
                  />
                  <Input style={
                    formErrors["username"] ? { border: "1px solid red" } : {}
                  } onBlur={(e) => handleOnBlur(e, "username")} type="text" placeholder="username" onChange={handleUsername} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup   >
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"

                    // eslint-disable-next-line react/no-children-prop
                    children={<CFaLock color="black" />}
                  />
                  <Input style={
 formErrors["password"] ? { border: "1px solid red" } : {}
} onBlur={(e) => handleOnBlur(e, "password")}

                    onChange={handlePassword}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />



                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
         

              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    // eslint-disable-next-line react/no-children-prop
                    children={<CFaLock color="black" />}
                  />
                  <Input onBlur={(e) => handleOnBlur(e, "confirmPassword")}
                    style={
                      formErrors["confirmPassword"] ? { border: "1px solid red" } : {}
                    }
                    onChange={handleConfirmPassword}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowConfirmClick}>
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>

              </FormControl>
              <Box style = {{ color: "red" }}> {errorMessage} </Box>

          
 
 
 <ReactiveButton
      buttonState={state}
      disabled={emailError === 'Email is not valid'|| username.length <= 0 || password.length <= 0 ||  password !== confirmPassword ? true : false}
      idleText="Submit"
      loadingText="Loading"
    
    style={{backgroundColor: '#ff147d'}}
      successText="Done"
      onClick={registerProfile}
    />


            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Alreadu have an account?{" "}
        <Link color="#ff147d" href="/Login">
          Login
        </Link>

      </Box>



    </PageLayout>
  );
};

export default IndexPage;
