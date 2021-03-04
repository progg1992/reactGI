//import { API } from '../utils/API';
import axios from 'axios';
import { returnErrors } from './errorActions';
import { USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, LOGIN_FAIL } from './types';

// Check token and load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });

    //Get token from local storge
    const token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    // If token, add to headers
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    axios.get('/api/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.res.data, err.res.status));
            dispatch({
                type: AUTH_ERROR
            });
        })
};

// Register User
export const register = ({ username, email, password }) => dispatch => {
    // headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({ username, email, password });

    axios.post('/api/users', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.res.data, err.res.status, 'REGISTER_FAIL'))
            dispatch({
                type: REGISTER_FAIL
            });
        });
}

// Login User
export const login = ({ username, email, password }) => dispatch => {
    // headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({ username, email, password });

    axios.post('/api/auth', body, config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.res.data, err.res.status, 'LOGIN_FAIL'))
            dispatch({
                type: LOGIN_FAIL
            });
        });
}

// Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

// Setup config/headers and token
export const tokenConfig = getState => {
    // Get token from localStorage
    const token = getState().token;

    //Headers
    let config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    // If token, add to headers
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
};