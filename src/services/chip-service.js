import axios from 'axios'
import API_URL_HOST from '../config/Config'
import authHeader from './auth-header'

const authToken=authHeader()
const url=API_URL_HOST.API_URL_HOST+'api/chip/'
const headers = {
    'Content-Type': 'application/json',
    'Authorization':  authToken.Authorization
  }
axios.interceptors.request.use((request)=>{
    return request
})
axios.interceptors.response.use((response)=>{
    if(response.status === 401){
        window.location.href='/login'
    }
    else{
        return response
    }
})
const getChips=()=>{
    return axios.get(
        url+'getjson',
        {
            headers: headers
        })
        .then((response)=>{
            return response
        })
}
const getChipById=(idchip) => {
    const data = { idchip: idchip };
    return axios.post(
        url+'getchipbyidjson',
        data,
        {
            headers: headers
        })
        .then((response)=>{
            return response
        })
}
const saveChipJson=(chip)=>{
    let saveUrl=''
    if(chip.idchip===0){
        saveUrl=url+'savechipjson'
    }
    else{
        saveUrl=url+'editchipjson'
    }
    console.log(saveUrl)
    return axios.post(
        saveUrl,
        chip,
        {
            headers: headers
        })
        .then((response)=>{
            return response
        })
}
export default {
    getChips,
    getChipById,
    saveChipJson
}