
import React,{useEffect} from "react";
import AuthService from "../../services/auth-service";
export default (props) => {
  useEffect(() => {
    const currentUser=AuthService.getCurrentUser()
    if(!currentUser){
      props.history.push('/')
      window.location.reload()
    }
    return () => {
    }
  },[])
  return (
    <>
       <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
         Hello World!
       </div>
    </>
  );
};
