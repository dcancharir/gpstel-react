import React,{useState,useEffect} from 'react'
import ChipService from '../../services/chip-service'
import AuthService from "../../services/auth-service"
import { Col, Row, Button,Modal, Form, Card } from '@themesberg/react-bootstrap'
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt,faEdit } from '@fortawesome/free-solid-svg-icons';
const initialChip={
    idchip:0,
    operador:'',
    tipo_contrato:'',
    numero:'',
    estado:''
}
const initialDataList=[{...initialChip}]
function ChipPage(props) {
    const [chipList,setChipList]=useState(initialDataList)
    const [chip,setChip]=useState(initialChip)
    const [showModal, setModalShow] = useState(false);
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
            name:'Estado',
            sortable:false,
            cell:(row,index)=>{
                return(
                <>
                    <select className="form-control input-sm input-lg" onChange={(event)=>handleChangechipState(event,row.idchip)} defaultValue={row.estado}>
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
                    </select>
                </>)
            }

        },
        {
            name:'Acciones',
            sortable:false,
            cell: (row,index) => <div>
                                    <button className="btn btn-outline-primary btn-sm me-1" onClick={()=>handleEditButtonClick(row.idchip)}><FontAwesomeIcon icon={faEdit} /></button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={()=>handleDeleteButtonClick(row.idchip)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                </div> ,
        },
        
    ]
    const paginationOptions={
        rowsPerPageText:'Filas por Página',
        rangeSeparatorText:'de',
        selectAllRowsItem:true,
        selectAllRowsItemText:'Todos'
    }
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);
    const showAlert=(icon,message)=>{
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: icon,
            title: message,
          })
    }
    const getChipsJson=() =>{
        ChipService.getChips().then((response)=>{
            const newChipList=response.data
            setChipList(newChipList)
            showAlert('success','Listando Registros')
        },
        (error)=>{
            showAlert('error','No se puedieron listar los registros')
        })
    }
    const handleSaveChanges=(chip)=>{
        if(chip.numero===''){
            showAlert('warning','Número es obligatorio')
            return false
        }
        if(chip.operador===''){
            showAlert('warning','Operador es obligatorio')
            return false
        }
        if(chip.tipo_contrato===''){
            showAlert('warning','Tipo de Contrato es obligatorio')
            return false
        }
        ChipService.saveChipJson(chip).then((response)=>{
            if(response.status===200){
                showAlert('success','Registro Editado')
                handleModalClose()
                if(chip.idchip===0){
                    const idchip=response.data
                    const newChip={
                        ...chip,
                        idchip:idchip
                    }
                    const newChipList=[
                        ...chipList,newChip
                    ]
                    setChipList(newChipList)
                }
                else{
                    const newChipList=chipList.map(item=>{
                        return  item.idchip===chip.idchip?chip:item
                        // if(item.idchip===chip.idchip){
                        //     return chip
                        // }else{
                        //     return item
                        // }
                    })
                    setChipList(newChipList)
                }
            }
            else{
                showAlert('error','No se pudo editar el registro')
            }
        },
        (error)=>{
            showAlert('error','No se pudo editar el registro')
        })
    }
    const handleNewButtonClick=()=>{
        setChip(initialChip)
        handleModalShow()
    }
    const handleEditButtonClick=(idchip)=>{
        ChipService.getChipById(idchip).then((response)=>{
            console.log(response)
            if(response.status===200){
                const newChip = response.data
                setChip(newChip)
                handleModalShow()
            }
        },
        (error)=>{
            showAlert('error','No se pudo obtener el registro')
        })
    }
    const handleDeleteButtonClick=(idchip)=>{
        const deletedChip={
            estado:'E',
            idchip:idchip
        }
        ChipService.editStateofChipJson(deletedChip).then((response)=>{
            if(response.data){
                showAlert('success','Registro Eliminado')
                const newChipList=chipList.filter(item=>item.idchip!==deletedChip.idchip)
                setChipList(newChipList)
            }
        })

    }
    const handleChangeInput=({target})=>{
        const newChip = {
            ...chip,[target.name]:target.value
        }
        setChip(newChip)
    }
    const handleChangechipState=({target},idchip)=>{
        const editedChip={
            ...initialChip,
            estado:target.value,
            idchip:idchip,
        }
        ChipService.editStateofChipJson(editedChip).then((response)=>{
            if(response.data){
                showAlert('success','Estado Editado')
                const newChipList=chipList.map(item=>{
                    if(item.idchip===editedChip.idchip){
                        const newChip={
                            ...item,
                            estado:target.value
                        }
                        return newChip
                    }else{
                        return item
                    }
                })
                setChipList(newChipList)
            }
        })
    }
    useEffect(()=>{
        if(!AuthService.getCurrentUser()){
            props.history.push('/')
            window.location.reload()
        }
        getChipsJson()
    },[])
    return (
        <>
            <div className="container">
             
                <Row className="justify-content-md-center">
                    <Col xs={12} sm={12} xl={12} md={12} className="mb-2 mt-1">
                        <Button onClick={handleNewButtonClick} variant="outline-success btn-block" size="sm">Nuevo Chip</Button>
                    </Col>
                    <Col xs={12} sm={12} xl={12} md={12} className="">
                        <DataTable
                            title="Lista de Chips"
                            columns={dataTableColums}
                            data={chipList}
                            pagination
                            paginationComponentOptions={paginationOptions}
                            // selectableRows
                            // onSelectedRowsChange={handleChange}
                        />
                    </Col>
                </Row>
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Chip</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Card border="light" className="bg-white shadow-sm mb-6">
                        <Card.Body>
                            <Form>
                            <Row>
                                <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Número</Form.Label>
                                    <Form.Control onChange={(event)=>handleChangeInput(event)} size="text" required type="text" name="numero" defaultValue={chip.numero} placeholder="Número" />
                                </Form.Group>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Operador</Form.Label>
                                        <Form.Select onChange={(event)=>handleChangeInput(event)} size="text" name="operador" defaultValue={chip.operador}>
                                        <option value="">Seleccione</option>
                                        <option value="claro">Claro</option>
                                        <option value="movistar">Movistar</option>
                                        <option value="bitel">Bitel</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} className="mb-3">
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Contrato</Form.Label>
                                    <Form.Select onChange={(event)=>handleChangeInput(event)} size="text" name="tipo_contrato" defaultValue={chip.tipo_contrato}>
                                    <option value="">Seleccione</option>
                                    <option value="prepago">Prepago</option>
                                    <option value="postpago">Postpago</option>
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                            </Row>
                            </Form>
                        </Card.Body>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>handleSaveChanges(chip)}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}
export default ChipPage
