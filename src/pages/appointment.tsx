import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/images/logo.png'

export default function RendezVous() {

  // const  { idMedcine } = useParams();
  // const  { login } = useParams();

  const router = useRouter();
  const [dateTime, setDateTime] = useState("");
  const data = router.query;

 console.log(data);
 

  useEffect(()=>{
    axios.get(`https://tatbib-api.onrender.com/medcine/getMedcineById/${data.id}`)
    .then(function (response) {
           console.log(response.data);
    }).catch(function (err) {
      console.log(err);
  });
 },[data.id])  

  if (typeof window !== 'undefined') {

  const idPatient =localStorage.getItem('id_patient') || '{}';

 
// ------------------------------- get information medcine's Appointment  ------------------------------


 const handleSubmit = (e:any) => {
  e.preventDefault();
  const token =localStorage.getItem("tokenPatient") || '{}';
  if (!token) {
    router.push('/login_patient'); 
    toast.warn('you are not connected!!!!!!', { position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "colored", })  
// toastr.warning('You must have an Account, Create it now')
}
else {
  const Appointment = {dateTime,medcine:data.id,patient:idPatient,loginMedcine:data.login};
console.log(Appointment);

axios.post(`https://tatbib-api.onrender.com/appointment/addAppointment`,Appointment)
    
  .then(res => {
  console.log(res.data.error);
  if(res.data.error === true){
    toast.info('this date has aleready reserved,Please choose another date', { 
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "colored", })          
   router.push('/appointment')
  }else{
      localStorage.setItem('id_appointment',res.data._id);
      router.push('/patient_dashboard')
      toast.success('Appointment Reserved Successfully', { 
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored", })    
      console.log(res.data);
  }

})
}

}
return (

    <div className="container-fluid px-0" style={{overflow: 'auto'}}>
        <section className="header-page">
            <div className="container">
                <div className="row justify-content-between py-3 align-items-center">
                    <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
                    <Link href="/"><Image alt="" src={logo} width="100"/></Link>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row align-items-center">
                <div className="blog-slider mt-5">

<div className="blog-slider__wrp swiper-wrapper">
  <div className="blog-slider__item swiper-slide">
    <div className="blog-slider__img">
      <Image src={logo} alt=""/>
    </div>
    <form  onSubmit={handleSubmit}>
    <div className="blog-slider__content">
    <div className="blog-slider__title"><h5 style={{color:'#2ca5b8'}}>Choose a time for your <b>Appointment :</b></h5></div>
   

      <input type="datetime-local" id="meeting-time"
       name="meeting-time"
       min={Date.now()}
       value={dateTime}
       onChange={e => setDateTime(e.target.value)}
       />
      <button type="submit"  className="blog-slider__button mt-5 s" style={{outline:"none"}}>
        Confirm
        <ToastContainer />
      </button>
   </div>
   </form>
  </div>
  
</div> 

{/* <div className="blog-slider__pagination"></div> */}

</div> 

                </div>
            </div>
        </section>
                    
     
            
        </div>     
  )
}
}
