import {createContext,useContext,useEffect,useReducer, useState} from 'react';

const intialState ={
    user:localStorage.getItem('user')!==undefined ? JSON.parse(localStorage.getItem('user')):null,
    token:localStorage.getItem('token') || null,
};

export const authContext = createContext(intialState);
const authReducer = (state,action)=>{
    switch(action.type){
        case 'LOGIN_START':
        return {
            user:null,
            token:null,
            apiKey:null,
        };
        case "LOGIN_SUCCESS":
            return {
                user:action.payload.user,
                token:action.payload.token,
                apiKey:action.payload.apiKey,
            };
            case 'LOGOUT':
                return {
                    user:null,
                    token:null,
                    apikey:null,
                }
        default:
            return state;
    }
}

export const AuthContextProvider = ({children})=>{
    const [state,dispatch] = useReducer(authReducer,intialState)
    const [thumbnails, setThumbnails] = useState([]);

    useEffect(()=>{
        localStorage.setItem('token',state.token)
        console.log('user',state.user);
    },[state])

    return <authContext.Provider value={{user:state.user, token:state.token, apikey:state.apiKey,thumbnails,setThumbnails,  dispatch}} >
        {children}
    </authContext.Provider>
}