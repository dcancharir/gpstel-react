
import React,{ useState,useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import BgImage from "../../assets/img/illustrations/signin.svg";
import AuthService from '../../services/auth-service'
import Swal from 'sweetalert2'
const initialCredentials={
  username:'',
  password:''
}

const Login= (props) => {
  const [credentials,setCredentials] = useState(initialCredentials)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if(currentUser){
      props.history.push('/dashboard')
      window.location.reload()
    }
    return () => {
    }
  }, [])
  const handleChangeInputs=({target})=>{
    const newCredentials={
      ...credentials,
      [target.name]:target.value
    }
    setCredentials(newCredentials)
  }
  const handleLogin=(event)=>{
    event.preventDefault()
    if(credentials.username===''){
      mostrarAlerta('error','Nombre de Usuario Obligatorio')
      return false
    }
    if(credentials.password===''){
      mostrarAlerta('error','Password Obligatorio')
      return false
    }
    AuthService.login(credentials.username,credentials.password).then(()=>{
      mostrarAlerta('success','Bienvenido al Sistema')
      setTimeout(()=>{
        props.history.push('/dashboard')
        window.location.reload()
      },2000)
   
    },(error)=>{
    })
  }
  const mostrarAlerta=(icon,message)=>{
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
  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Acceso al Sistema</h3>
                </div>
                <Form className="mt-4">
                  <Form.Group id="username" className="mb-4">
                    <Form.Label>Usuario</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="text" name="username" placeholder="Usuario" onChange={(event)=>handleChangeInputs(event)}/>
                    </InputGroup>
                    
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" name="password" placeholder="Password" onChange={(event)=>handleChangeInputs(event)} />
                      </InputGroup>
                    </Form.Group>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100" onClick={(event)=>handleLogin(event)}>
                    Acceder
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
export default Login