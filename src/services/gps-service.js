import axiosInstance from './axiosInstance';

const url='api/gps/'

const getGpss=()=>{
    return axiosInstance.get(url+'getjson')
}
const getGpsById=(idgps) => {
    const data = { idgps: idgps };
    return axiosInstance.post(url+'getgpsbyidjson',data)
}
const saveGpsJson=(gps)=>{
    let saveUrl=url
    saveUrl+=gps.idgps===0?'savegpsjson':'editgpsjson'
    return axiosInstance.post(saveUrl,gps)
}
const editStateofGpsJson=(gps)=>{
    return axiosInstance.post(url+'editstateofgpsjson',gps)
}
export default {
    getGpss,
    getGpsById,
    saveGpsJson,
    editStateofGpsJson,
}