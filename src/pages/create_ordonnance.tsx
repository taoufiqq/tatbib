import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/images/logo.png'
import withAuth from '@/components/withPrivateRoute';
import moment from 'moment';
 const CreateOrdonnances=()=> {

    const router = useRouter();

    const [fullNameDoctor, setFullNameDoctor] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [firstNamePatient, setFirstNamePatient] = useState("");
    const [lastNamePatient, setLastNamePatient] = useState("");
    const [date, setDate] = useState("");
    // const [time, setTime] = useState("");
    const [medicamment, setMedicamment] = useState("");

    // const [password, setPassword] = useState("");


    // const [appointment, setAppointment] = useState();
  // const id=localStorage.getItem('id_medcine'); 
    useEffect(()=>{
        const idAppointment=localStorage.getItem('idAppointment'); 
      axios.get(`https://tatbib-api.onrender.com/appointment/getAppointmenById/${idAppointment}`)
      .then(function (response) {
       
        setFullNameDoctor(response.data.medcine.fullName)
        setSpeciality(response.data.medcine.speciality)
        setFirstNamePatient(response.data.patient.firstName)
        setLastNamePatient(response.data.patient.lastName)
        setDate(response.data.dateTime)
        // setTime(response.data.time)
      }).catch(function (err) {
        console.log(err);
    });
    
    },[])


const handleSubmit = (e:any) => {
    e.preventDefault();

    const idPatient =localStorage.getItem('id_patient')
    const idMedcine =localStorage.getItem('id_medcine')



const Ordonnance = {medcine:idMedcine,patient:idPatient,medicamment};

axios.post(`https://tatbib-api.onrender.com/medcine/addOrdonnance`,Ordonnance)
      
    .then(res => {
        if(!res.data){
            return false
        }else{
      console.log(res.data);
      router.push('/list_appointments_medicine')
      toast.success('Ordonnance created SuccessFully', { 
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored", })   
    //   toastr.success('Ordonnance added SuccessFully')
        }
     
    })
}
  return (

  <section className="header-page noPrint">
    <div className="container">
           <div className="row justify-content-between py-3 align-items-center">
                    <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
                        <Link href="/medicine_dashboard"><Image alt="" src={logo} width="100"/></Link>
                    </div>                  
           </div>
      <div className="cardOrdonnance">
           <Image alt="" src={logo} width="100"/>
        <div className="row ">



          <div>      
           <form className="row"  method="#" action="#" onSubmit={handleSubmit}>
                 <label className="OrdonnanceDate"><span  style={{color:'red'}}>Dr </span>{fullNameDoctor}</label>
                 <label className="OrdonnanceDate" style={{color:'green'}}>{speciality}</label>
                   <div>
                     <label className="OrdonnanceDoctor" ><span style={{color:'red'}}>Mr/Mme </span >{firstNamePatient} {lastNamePatient}</label>
                   </div>
  
              <div className="fromloginSignUp">
                <div className="row ">
          
          {/* <td>{moment(item.dateTime).format(`HH:MM`)}</td> */}
                   <label className="dateOrdonnance">{moment(date).format(`MMMM DD YYYY ---> HH:MM`)}</label>
   
                </div>
               </div>
               <div className="form-floating">
                   <textarea className="form-control" placeholder="medicamment" id="floatingTextarea2" style={{height:"300px"}}
                   value={medicamment}
                   onChange={e => setMedicamment(e.target.value)} 
                   ></textarea>
               </div>
               <div>
                 <input type="submit"  className="form-control mt-5 btnConnect"  value="Confirm"/>
               </div>
           </form>
          </div>
     





        </div>
      </div>
    </div>
  </section>

    )
}
export default withAuth(CreateOrdonnances)