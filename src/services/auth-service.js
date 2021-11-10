import axios from 'axios'
import API_URL_HOST from '../config/Config'

const url=API_URL_HOST.API_URL_HOST+'api/login/'
const login=(username,password)=>{

    return axios.post(
        url+'authenticate',
        {
            username,password
        })
        .then((response)=>{
            if(response.data.token){
                localStorage.setItem('user',JSON.stringify(response.data))
            }
            return response
        })
}
const logout = () => {
    localStorage.removeItem("user")
    window.location.href = '/';
}
const getCurrentUser=()=>{
    return localStorage.getItem("user")
}
export default {
    login,
    logout,
    getCurrentUser,
}