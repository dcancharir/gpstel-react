import React,{useState,useEffect} from 'react'
import ChipService from '../../services/chip-service'
import AuthService from "../../services/auth-service";
const initialChip={
    idchip:0,
    operador:'',
    tipo_contrato:'',
    numero:''
}
const initialDataList=[{...initialChip}]

function ChipPage(props) {
    const [chipList,setChipList]=useState(initialDataList)
    const [chip,setChip]=useState(initialChip)
    useEffect(()=>{
        const currentUser=AuthService.getCurrentUser()
        if(!currentUser){
            props.history.push('/')
            window.location.reload()
        }
        ChipService.getChips().then((response)=>{
                setChipList(response.data)
            },
            (error)=>{

            }
        )
    },[])
    console.log(chipList)

    return (
        <div>
            Chip Page
        </div>
    )
}

export default ChipPage
