import {atom, useAtom} from 'jotai';

const jwtAtom = atom("");

export function useJwt() {
    const [jwt, setJwtAtom] = useAtom(jwtAtom);

    const setJwt = (newJwt) => {
        // need to save in local storage (stores key value pairs in browser's cookies) ->
        // if u reload, everything in jotai is gone -> need save in localStorage
        localStorage.setItem('jwt', newJwt);

        // set the atom to store the new jwt -> allow for sharing btwn components
        setJwtAtom(newJwt);
    }

    const getJwt = () => {
        const storedJwt = localStorage.getItem('jwt');
        // if there is a storedJwt in localstorage and no existing jwt
        if (storedJwt && !jwt) {
            setJwtAtom(storedJwt);
        }
        // first truthy value will be returned -> so if got existing jwt -> return the jwt;
        // if there is one jwt in storage but no existing jwt -> return storedJwt
        return jwt || storedJwt;
    }

    const clearJwt = () => {
        localStorage.removeItem('jwt');
        setJwtAtom(null);
    }

    return {
        setJwt, getJwt, clearJwt
    }
}