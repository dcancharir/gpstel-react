
import React,{ useState,useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Button, FormCheck, Container, InputGroup, Alert } from '@themesberg/react-bootstrap';
import BgImage from "../../assets/img/illustrations/signin.svg";
import AuthService from '../../services/auth-service'

export default (props) => {
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [usernameError,setUsernameError]=useState(false)
  const [passwordError,setPasswordError]=useState(false)
  const [loginError,setLoginError]=useState(false)
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if(currentUser){
      props.history.push('/dashboard')
      window.location.reload()
    }
    return () => {
    }
  }, [])
  const handleChangeUsername=({target})=>{
    setUsername(target.value)
  }
  const handlePasswordChange=({target})=>{
    setPassword(target.value)
  }
  const handleLogin=(event)=>{
    event.preventDefault()
    if(username===''){
      setUsernameError(true)
      return false
    }
    if(password===''){
      setPasswordError(true)
      return false
    }
    setUsernameError(false)
    setPasswordError(false)
    AuthService.login(username,password).then(()=>{
       props.history.push('/dashboard')
       window.location.reload()
    },(error)=>{
      setLoginError(true)
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
                    { loginError &&
                      <Alert variant={'danger'} style={{marginTop:'5px'}}>
                          Error al intentar acceder
                      </Alert>
                    }
                <Form className="mt-4">
                  <Form.Group id="username" className="mb-4">
                    <Form.Label>Usuario</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="text" placeholder="Usuario" onChange={(event)=>handleChangeUsername(event)}/>
                    </InputGroup>
                    { usernameError &&
                      <Alert variant={'danger'} style={{marginTop:'5px'}}>
                          Nombre de Usuario es Obligatorio
                      </Alert>
                    }
                    
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" placeholder="Password" onChange={(event)=>handlePasswordChange(event)} />
                      </InputGroup>
                    </Form.Group>
                      { passwordError &&
                        <Alert variant={'danger'} style={{marginTop:'5px'}}>
                            Password es Obligatorio
                        </Alert>
                      }
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Recordarme</FormCheck.Label>
                      </Form.Check>
                    </div>
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