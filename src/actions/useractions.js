import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  CLEAR_ERRORS,
} from '../constants/userconstant.js'
import axios from 'axios'

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({type: LOGIN_REQUEST})

    const config = {headers: {'Content-Type': 'application/json'}}

    const {data} = await axios.post(
      `http://localhost:4000/api/v1/UserLogin`,
      {email, password},
      config
    )

    await axios
      .get(`http://localhost:4000/api/v1/GetLoginUserDetails`)
      .then((response) => {
        console.log('37', response)
      })
      .catch((err) => {
        console.log('41', err)
      })

    dispatch({type: LOGIN_SUCCESS, payload: data.user})
  } catch (error) {
    dispatch({type: LOGIN_FAIL, payload: error.response.data.message})
  }
}

// Register
export const register = (name, email, password, avatar) => async (dispatch) => {
  try {
    dispatch({type: REGISTER_USER_REQUEST})

    const config = {headers: {'Content-Type': 'application/json'}}

    const res = await axios.post(
      `http://localhost:4000/api/v1/UserRegister`,
      {name, email, password, avatar},
      config
    )

    dispatch({type: REGISTER_USER_SUCCESS, payload: res.data.user})
  } catch (error) {
    console.log(error)
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response?.data.message,
    })
  }
}

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({type: LOAD_USER_REQUEST})

    const {data} = await axios.get(`http://localhost:4000/api/v1/me`)

    dispatch({type: LOAD_USER_SUCCESS, payload: data.user})
  } catch (error) {
    dispatch({type: LOAD_USER_FAIL, payload: error.response.data.message})
  }
}

// Logout User
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`http://localhost:4000/api/v1/UserLogout`)

    dispatch({type: LOGOUT_SUCCESS})
  } catch (error) {
    dispatch({type: LOGOUT_FAIL, payload: error.response.data.message})
  }
}

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({type: FORGOT_PASSWORD_REQUEST})
    console.log(93, email)

    const config = {headers: {'Content-Type': 'application/json'}}

    const res = await axios.post(
      `http://localhost:4000/api/v1/Password/UserForgotPassword`,
      {email},
      config
    )

    console.log(103, res)
    dispatch({type: FORGOT_PASSWORD_SUCCESS, payload: res.data.message})
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    })
  }
}

// Reset Password
export const resetPassword =
  (token, password, confirmpassword) => async (dispatch) => {
    try {
      dispatch({type: RESET_PASSWORD_REQUEST})

      const config = {headers: {'Content-Type': 'application/json'}}

      const {data} = await axios.put(
        `http://localhost:4000/api/v1/Password/UserResetPassword/${token}`,
        {password, confirmpassword},
        config
      )

      dispatch({type: RESET_PASSWORD_SUCCESS, payload: data.success})
    } catch (error) {
      dispatch({
        type: RESET_PASSWORD_FAIL,
        payload: error.response.data.message,
      })
    }
  }

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({type: CLEAR_ERRORS})
}
