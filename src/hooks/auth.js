import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { DASHBOARD } from '../lib/routes';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../lib/routes';
import { useSignOut } from 'react-firebase-hooks/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import jwt_decode from 'jwt-decode';
import isUsernameExists from '../utils/isUsernameExist';

export function useAuth() {
  const [authUser, isLoading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null); // State to store user data

  // Fetch user data when authUser changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser) {
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserData(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [authUser]);

  // Extract the email and username separately
  const email = authUser?.email || '';
  const username = userData?.username || '';

  // Check for the presence of a valid JWT token
  const token = localStorage.getItem('token');
  const isValidToken = token ? true : false;

  return { user: { ...authUser, username }, email, isLoading, error, isValidToken };
}

export function useLogin() {
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function login({ email, password, redirectTo = DASHBOARD }) {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if the user's email is verified
      if (!userCredential.user.emailVerified) {
        toast({
          title: 'Email not verified',
          description: 'Please verify your email before logging in.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 5000,
        });
        setLoading(false);
        return false; // Return false if login failed due to unverified email
      }

      // Access the username and print it
      const username = await fetchUsername(userCredential.user.uid);
      console.log('Logged in as:', username);

      // Check if the account is deactivated
      if (username.includes("(deactivated)")) {
        toast({
          title: 'This account has been deactivated, please contact the administrator.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 5000,
        });
        setLoading(false);
        return false; // Return false if login failed due to deactivated account
      }

      // Get JWT token
      const idToken = await userCredential.user.getIdToken();
      console.log('JWT Token:', idToken);

      // Store JWT token in local storage
      localStorage.setItem('token', idToken);

      toast({
        title: 'You are logged in',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 5000,
      });
      navigate(redirectTo);
    } catch (error) {
      toast({
        title: 'Log in failed',
        description: 'Make sure you\'ve entered the correct credentials!',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 5000,
      });
      setLoading(false);
      return false; // Return false if login failed
    } finally {
      setLoading(false);
    }

    return true; // Return true if login success
  }

  // Function to fetch the username from Firestore
  async function fetchUsername(uid) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.username;
      }

      return null;
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  }

  return { login, isLoading };
}

export function useRegister() {
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function register({ username, email, password, redirectTo = DASHBOARD }) {
    setLoading(true);

    const usernameExists = await isUsernameExists(username);

    if (usernameExists) {
      toast({
        title: 'Username already exists',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 5000,
      });
      setLoading(false);
    } else {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        // Send email verification
        await sendEmailVerification(res.user);

        // Additional user creation logic
        await setDoc(doc(db, 'users', res.user.uid), {
          id: res.user.uid,
          username: username.toLowerCase(),
          avatar: '',
          date: Date.now(),
        });

        toast({
          title: 'Account created',
          description: 'A verification email has been sent. Please check your inbox.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 5000,
        });

        navigate(redirectTo);
      } catch (error) {
        toast({
          title: 'Signing Up failed',
          description: error.message,
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    }
  }

  return { register, isLoading };
}

export function useLogout() {
  const [signOut, isLoading, error] = useSignOut(auth);
  const toast = useToast();
  const navigate = useNavigate();

  async function logout() {
    if (await signOut()) {
      toast({
        title: 'Successfully logged out',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 5000,
      });
      localStorage.removeItem('token');
      navigate(LOGIN);
    } // else: show error [signOut() returns false if failed]
  }

  return { logout, isLoading };
}
