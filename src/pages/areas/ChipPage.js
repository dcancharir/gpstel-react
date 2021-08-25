import React,{useState,useEffect,useCallback} from 'react'
import ChipService from '../../services/chip-service'
import AuthService from "../../services/auth-service"
import { Col, Row, Button, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap'
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2'
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
    const [selectedRows, setSelectedRows] = useState([]);
    const dataTableColums=[
        {
            name:'Id',
            selector:row=>row.idchip,
            sortable:false,
        },
        {
            name:'Operador',
            selector:row=>row.operador,
            sortable:true,
        },
        {
            name:'Tipo Contrato',
            selector:row=>row.tipo_contrato,
            sortable:true,
        },
        {
            name:'Numero',
            selector:row=>row.numero,
            sortable:true,
        },
        {
            name:'Acciones',
            sortable:false,
            cell: (row,index) => <div>
                                    <button className='btn btn-primary btn-outline btn-sm' onClick={handleButtonClick}>Editar</button>
                                    <button className='btn btn-danger btn-outline btn-sm' onClick={handleButtonClick}>Eliminar</button>
                                </div> ,
        },
        
    ]
    const paginationOptions={
        rowsPerPageText:'Filas por Página',
        rangeSeparatorText:'de',
        selectAllRowsItem:true,
        selectAllRowsItemText:'Todos'
    }
    const mostrarAlerta=()=>{
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: 'Listando Registros',
          })
    }
    const getChipsJson=() =>{
        ChipService.getChips().then((response)=>{
            setChipList(response.data)
            mostrarAlerta()
        },
        (error)=>{
            console.log(error)
        })
    }
    const redirecIfNotAuthenticated=()=>{
        if(!AuthService.getCurrentUser()){
            props.history.push('/')
            window.location.reload()
        }
    }
    const handleButtonClick=()=>{

    }
    const handleChange = useCallback(state => {
		setSelectedRows(state.selectedRows);
        console.log(state.selectedRows)
	}, []);
    useEffect(()=>{
        redirecIfNotAuthenticated()
        getChipsJson()
    },[])
    return (
        <div className="container">
            <Row className="justify-content-md-center">
                <Col xs={12} sm={12} xl={12} md={12} className="m-4">
                    <DataTable
                        title="Lista de Chips"
                        columns={dataTableColums}
                        data={chipList}
                        pagination
                        paginationComponentOptions={paginationOptions}
                        selectableRows
                        onSelectedRowsChange={handleChange}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ChipPage
