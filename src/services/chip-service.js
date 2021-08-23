import axios from 'axios'
import API_URL_HOST from '../config/Config'
import authHeader from './auth-header'
const authToken=authHeader()
const url=API_URL_HOST.API_URL_HOST+'api/chip/'

const getChips=()=>{
    return axios.get(
        url+'getjson',
        {
            headers: {
                'Authorization': authToken.Authorization,
                'Content-Type': 'application/json',
            }
        })
        .then((response)=>{
            return response
        })
}
export default {
    getChips,
}