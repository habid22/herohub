
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../lib/firebase';

export function useAuth() {
    const [authUser, isLoading, error] = useAuthState(auth);


    return {user: authUser, isLoading, error};
}