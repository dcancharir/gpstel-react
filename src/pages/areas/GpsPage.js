import React,{useState,useEffect} from 'react'
import GpsService from '../../services/gps-service'
import AuthService from "../../services/auth-service"
import { Col, Row, Button,Modal, Form, Card, InputGroup } from '@themesberg/react-bootstrap'
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt,faEdit, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Datetime from "react-datetime";
import moment from "moment-timezone";
import ChipService from '../../services/chip-service'
const initialChip={
    idchip:0,
    operador:'',
    tipo_contrato:'',
    numero:'',
    estado:''
}
const initialGps={
    idgps:0,
    modelo:'',
    estado_uso:'',
    garantia:'',
    idchip:0,
    fecha_compra:moment(Date.now()).format('DD/MM/YYYY'),
    imei:'',
    estado:'',
    Chip:{...initialChip}
}
const initialDataList=[{...initialGps}]
function GpsPage(props) {
    const [gpsList,setGpsList]=useState(initialDataList)
    const [gps,setGps]=useState(initialGps)
    const [showModal, setModalShow] = useState(false)
    const [birthday, setBirthday] = useState("")
    const [chipList,setChipList]=useState([{...initialChip}])

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
    const getGpssJson=() =>{
        GpsService.getGpss().then((response)=>{
            const newGpsList=response.data
            setGpsList(newGpsList)
            showAlert('success','Listando Registros')
        },
        (error)=>{
            showAlert('error','No se puedieron listar los registros')
        })
    }
    const getChipsJson=()=>{
        ChipService.getChips().then((response)=>{
            const newChipList=response.data
            setChipList(newChipList)
        },
        (error)=>{
            console.log(error)
        })
    }
    const handleSaveChanges=(gps)=>{
        if(gps.modelo===''){
            showAlert('warning','Modelo es obligatorio')
            return false
        }
        if(gps.garantia===''){
            showAlert('warning','Garantia es obligatorio')
            return false
        }
        if(gps.fecha_compra===''){
            showAlert('warning','Fecha Compra es obligatorio')
            return false
        }
        if(gps.imei===''){
            showAlert('warning','Imei Compra es obligatorio')
            return false
        }
        GpsService.saveGpsJson(gps).then((response)=>{
            if(response.status===200){
                showAlert('success','Registro Editado')
                handleModalClose()
                if(gps.idgps===0){
                    const idgps=response.data
                    const newGps={
                        ...gps,
                        idgps:idgps
                    }
                    const newGpsList=[
                        ...gpsList,newGps
                    ]
                    setGpsList(newGpsList)
                }
                else{
                    const newGpsList=gpsList.map(item=>{
                        return  item.idgps===gps.idgps?gps:item
                        // if(item.idchip===chip.idchip){
                        //     return chip
                        // }else{
                        //     return item
                        // }
                    })
                    setGpsList(newGpsList)
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
        setGps(initialGps)
        handleModalShow()
    }
    const handleEditButtonClick=(idgps)=>{
        GpsService.getGpsById(idgps).then((response)=>{
            if(response.status===200){
                const newGps = response.data
                setGps(newGps)
                handleModalShow()
            }
        },
        (error)=>{
            showAlert('error','No se pudo obtener el registro')
        })
    }
    const handleDeleteButtonClick=(idgps)=>{
        const deletedGps={
            estado:'E',
            idgps:idgps
        }
        GpsService.editStateofGpsJson(deletedGps).then((response)=>{
            if(response.data){
                showAlert('success','Registro Eliminado')
                const newGpsList=gpsList.filter(item=>item.idgps!==deletedGps.idgps)
                setGpsList(newGpsList)
            }
        })

    }
    const handleChangeInput=({target})=>{
        console.log(target)
        const newGps = {
            ...gps,[target.name]:target.value
        }
        setGps(newGps)
    }
    const handleChangeGpsState=({target},idgps)=>{
        const editedGps={
            ...initialGps,
            estado:target.value,
            idgps:idgps,
        }
        GpsService.editStateofGpsJson(editedGps).then((response)=>{
            if(response.data){
                showAlert('success','Estado Editado')
                const newGpsList=gpsList.map(item=>{
                    if(item.idgps===editedGps.idgps){
                        const newGps={
                            ...item,
                            estado:target.value
                        }
                        return newGps
                    }else{
                        return item
                    }
                })
                setGpsList(newGpsList)
            }
        })
    }
    const handleChangeInputDate=(event)=>{
        const newGps={
            ...gps,
            fecha_compra:moment(event._d).format('DD/MM/YYYY')
        }
        setGps(newGps)
        setBirthday(event._d)
    }
    const dataTableColums=[
        {
            name:'Id',
            selector:row=>row.idgps,
            sortable:false,
        },
        {
            name:'Modelo',
            selector:row=>row.modelo,
            sortable:true,
        },
        {
            name:'Estado Uso',
            selector:row=>row.estado_uso,
            sortable:true,
        },
        {
            name:'Garantia',
            selector:row=>row.garantia,
            sortable:true,
        },
        {
            name:'Chip',
            sortable:true,
            cell:(row,index)=>{
                console.log(row)
                return (<>
                    {row.Chip.operador} - {row.Chip.numero}
                </>)
            }
        },
        {
            name:'Fecha Compra',
            selector:row=>row.fecha_compra,
            cell:(row,index)=>{
                return moment(row.fecha_compra).format("MM/DD/YYYY") 
            }
            // cell:(row,index)=>{
            //     let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(row.fecha_compra);
            //     let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(row.fecha_compra);
            //     let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(row.fecha_compra);
            //     return (
            //         <>
            //             {da}-{mo}-{ye}
            //         </>
            //     )
            // }
        },
        {
            name:'Imei',
            selector:row=>row.imei,
            sortable:true,
        },
        {
            name:'Estado',
            sortable:false,
            cell:(row,index)=>{
                return(
                <>
                    <select className="form-control input-sm input-lg" onChange={(event)=>handleChangeGpsState(event,row.idgps)} defaultValue={row.estado}>
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
                                    <button className="btn btn-outline-primary btn-sm me-1" onClick={()=>handleEditButtonClick(row.idgps)}><FontAwesomeIcon icon={faEdit} /></button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={()=>handleDeleteButtonClick(row.idgps)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                </div> ,
        },
        
    ]
    const paginationOptions={
        rowsPerPageText:'Filas por Página',
        rangeSeparatorText:'de',
        selectAllRowsItem:true,
        selectAllRowsItemText:'Todos'
    }
    useEffect(()=>{
        if(!AuthService.getCurrentUser()){
            props.history.push('/')
            window.location.reload()
        }
        getGpssJson()
        getChipsJson()
    },[])
    return (
        <>
            <div className="container">
             
                <Row className="justify-content-md-center">
                    <Col xs={12} sm={12} xl={12} md={12} className="mb-2 mt-1">
                        <Button onClick={handleNewButtonClick} variant="outline-success btn-block" size="sm">Nuevo Gps</Button>
                    </Col>
                    <Col xs={12} sm={12} xl={12} md={12} className="">
                        <DataTable
                            title="Lista de Gps's"
                            columns={dataTableColums}
                            data={gpsList}
                            pagination
                            paginationComponentOptions={paginationOptions}
                            // selectableRows
                            // onSelectedRowsChange={handleChange}
                        />
                    </Col>
                </Row>
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Gps</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Card border="light" className="bg-white shadow-sm mb-6">
                        <Card.Body>
                            <Form>
                            <Row>
                                <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Modelo</Form.Label>
                                    <Form.Control onChange={(event)=>handleChangeInput(event)} size="text" required type="text" name="modelo" defaultValue={gps.modelo} placeholder="Modelo" />
                                </Form.Group>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Estado de Uso</Form.Label>
                                        <Form.Select onChange={(event)=>handleChangeInput(event)} size="text" name="estado_uso" defaultValue={gps.estado_uso}>
                                        <option value="">Seleccione</option>
                                        <option value="nopropio">No Propio</option>
                                        <option value="usado">Usado</option>
                                        <option value="nuevo">Nuevo</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Garantia</Form.Label>
                                    <Form.Control onChange={(event)=>handleChangeInput(event)} size="text" required type="text" name="modelo" defaultValue={gps.garantia} placeholder="Garantia" />
                                </Form.Group>
                                </Col>
                                <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Chip</Form.Label>
                                    <Form.Select onChange={(event)=>handleChangeInput(event)} placeholder="Chip" required size="text" name="idchip" defaultValue={gps.idchip}>
                                        {
                                            chipList.map(item=>{
                                              return <option key={item.idchip} value={item.idchip} >{item.operador} - {item.numero}</option>
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Fecha Compra</Form.Label>
                                    <Datetime
                                        timeFormat={false}
                                        closeOnSelect={false}
                                        onChange={(event)=>handleChangeInputDate(event)}
                                        name="fecha_compra"
                                        renderInput={(props, openCalendar) => (
                                            <InputGroup>
                                            <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                            <Form.Control
                                                required
                                                type="text"
                                                value={gps.fecha_compra ? moment(gps.fecha_compra).format("MM/DD/YYYY") : ""}
                                                placeholder="mm/dd/yyyy"
                                                onFocus={openCalendar}
                                                onChange={ () => { }}
                                                />
                                            </InputGroup>
                                        )} />
                                </Form.Group>
                                </Col>
                                <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>IMEI</Form.Label>
                                    <Form.Control onChange={(event)=>handleChangeInput(event)} size="text" required type="text" name="imei" defaultValue={gps.imei} placeholder="IMEI" />
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
                    <Button variant="primary" onClick={()=>handleSaveChanges(gps)}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}
export default GpsPage