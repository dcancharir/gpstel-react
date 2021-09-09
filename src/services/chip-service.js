import axiosInstance from './axiosInstance';

const url='api/chip/'

const getChips=()=>{
    return axiosInstance.get(url+'getjson')
}
const getChipById=(idchip) => {
    const data = { idchip: idchip };
    return axiosInstance.post(url+'getchipbyidjson',data)
}
const saveChipJson=(chip)=>{
    let saveUrl=url
    saveUrl+=chip.idchip===0?'savechipjson':'editchipjson'
    return axiosInstance.post(saveUrl,chip)
}
const editStateofChipJson=(chip)=>{
    return axiosInstance.post(url+'editstateofchipjson',chip)
}
export default {
    getChips,
    getChipById,
    saveChipJson,
    editStateofChipJson,
}