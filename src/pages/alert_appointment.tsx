import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/images/ss.jpg'
import withAuth from '@/components/withPrivateRoute';
import alert from '../../public/images/alert.svg'
 const AlertAppointment = ()=> {
  
  const router = useRouter();

//   const [status, setStatus] = useState("");
//   const [updatedStatus, setUpdatedStatus] = useState("");
  const [email, setEmail] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [calledPush, setCalledPush] = useState(false); // <- add this state

//   if (!redirectTo) return;
//   if (
//     (redirectTo && !redirectIfFound && !hasUser) ||
//     (redirectIfFound && hasUser)
//   ) {
//       // check if we have previously called router.push() before redirecting
//     if (calledPush) {
//       return; // no need to call router.push() again
//     }

//     Router.push(redirectTo);
//     setCalledPush(true); // <-- toggle 'true' after first redirect
//   }
// }, [redirectTo, redirectIfFound, hasUser]);

useEffect(()=>{
    const id_Appointment =localStorage.getItem('idAppointment')

    axios.get(`https://tatbib-api.onrender.com/appointment/getAppointmenById/${id_Appointment}`)
    .then(function (response) {
     
      setEmail(response.data.patient.email)
      setDateTime(response.data.dateTime)
      console.log(response.data.patient.email);
    }).catch(function (err) {
      console.log(err);
  });
  
  })

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const id_Appointment =localStorage.getItem('idAppointment')

    const data = {email,dateTime};

    axios.put(`https://tatbib-api.onrender.com/secretary/alertAppointment/${id_Appointment}`,data)
    .then(res => {
      if(res.data.message){
        return false
      }else{
        router.push('/secretary_dashboard', undefined, { shallow: true });
        toast.success('Alert has been sent successfully', { position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored", })    
      }
     
    })
  
  }

    return ( 
        <div className="Containerr" style={{overflow: 'hidden'}}>

  <main>
 
  <div className="table">
  <div className="table-wrapper">
    <div className="table-title">
      <div className="row">
        <div className="col-sm-5">
          <h2>Appointment <b>Management Appointment</b></h2>
        </div>
      </div>
    </div>

  </div>
</div>
 <div className="col-12 col-md-6 col-lg-6 px-5 py-4 ConfirmForm">
<h2 className="h2">Reminder Appointment</h2>
<form onSubmit={handleSubmit} >
    <div className="col-12">
        <div className="input-icons mb-4">
         <Image alt="" src={alert} style={{width:'60%'}}/>
        </div>
    </div>
    <div className="d-grid">
        <button type="submit" className="button1 py-3" style={{width:"30%",marginLeft:"35%",backgroundColor:"red"}}>
        <ToastContainer/>
            Reminder
        </button>
    </div>
</form>
</div> 
  </main>
</div> 
     );
}
export default withAuth(AlertAppointment)






