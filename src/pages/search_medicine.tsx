import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import logo from '../../public/images/logo.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SearchMedcine() {

    // const medecin = localStorage.getItem('medecin');
    // this.medecin = medecinJson !== null ? JSON.parse(medecinJson) ;

    // const [medcine, setMedcine] = useState<Medc[] | null>(null);
    const router = useRouter()
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      const medecin = JSON.parse(localStorage.getItem('medcine') || '{}');
      const token =  localStorage.getItem('tokenPatient') || "";

      // const takeAppointment =()=>{
      //        if(!token){
      //         router.push('/login_patient'); 
      //         toast.warn('you are not connected!!!!!!', { position: "top-center",
      //         autoClose: 5000,
      //         hideProgressBar: false,
      //         closeOnClick: false,
      //         pauseOnHover: false,
      //         draggable: false,
      //         progress: undefined,
      //         theme: "colored", })  
      //        }
      //       //  else{
      //       //   router.push('/appointment');
      //       //   // localStorage.setItem("LoginMedcine", medecin.login);
      //       //   // {`/appointment/${item._id}/${item.login}`} 
      //       //  }
      
      //   }
      
   

  console.log(medecin);


  const listMedcines = medecin.map((item:any,index:number) =>


  <div className="blog-slider mt-5" key={index}>

  <div className="blog-slider__wrp swiper-wrapper">
    <div className="blog-slider__item swiper-slide">
      <div className="blog-slider__img">
        <Image src={logo} alt=""/>
      </div>
      <div className="blog-slider__content">
  <div className="blog-slider__title"><h4>{item.fullName}</h4></div>
  <span className="blog-slider__code">{item.speciality}</span>        
  <div className="blog-slider__code">{item.city}</div>
  <div className="blog-slider__title" style={{color: item.availablity !== "NotAvailable"?'color': 'red'}}>{item.availablity}</div>
  <Link 
    href={{
      pathname: '/appointment',
      query: {
        id:item._id,
        login:item.login

      } // the data
    }}
        className="blog-slider__button" 
        style={{visibility: item.availablity !== "NotAvailable"?'visible':'hidden'}}>Take Appointment</Link>
  <Link href="" className="blog-slider__button" style={{visibility: item.availablity !== "NotAvailable"?'visible':'hidden'}} >teleConsiel</Link>
  </div>
    </div>
    
  </div> 
  
  {/* <div className="blog-slider__pagination"></div> */}

 </div> 
);



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
                {listMedcines}

                </div>
            </div>
        </section>
                    
     
            
        </div>     
  )
}
}
