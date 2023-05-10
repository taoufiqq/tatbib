import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import logo from '../../public/images/logo.png'
import health from '../../public/images/healthh.svg'
import icon1 from '../../public/images/map-doctor.png'
import icon2 from '../../public/images/bell.png'
import icon3 from '../../public/images/phone-alt.png'
import icon4 from '../../public/images/clipboard-list.png'
import Medicine from '../../public/images/doctor.png'
import wiqaytna from '../../public/images/wiqaytna.png'
import { Medc } from '@/types'



export default function Home() {

  const [speciality, setSpeciality] = useState("");
  // const [fullName, setFullName] = useState("");

  const router = useRouter()

  const [medcine, setMedcine] = useState<Medc[] | null>(null);

  useEffect(()=>{

    axios.get(`https://tatbib-api.onrender.com/medcine/getAllMedcine`)
      .then(function (response) {
          
        setMedcine(response.data)
        setSpeciality(response.data.speciality)
      }).catch(function (err) {
        console.log(err);
    });
    
    },[])


    const handleSubmit = (e:any) => {
      e.preventDefault();
      // console.log(speciality);

  axios.get(`https://tatbib-api.onrender.com/medcine/searchMedcine/${speciality}`)   
      .then(res => {
          if(!res.data){
              return false
          } else{
          localStorage.setItem('medcine', JSON.stringify(res.data));
          router.push('/search_medicine')
        }
      })
  }


  
  return (
    <div className="" style={{overflow: 'auto'}}>
    <section className="header-page">
        <div className="container">
            <div className="py-3 row justify-content-between align-items-center">
                <div className="py-2 col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-lg-0">
                   <Image alt="" src={logo} width="100"/>
                </div>
                <div className="col-12 col-sm-9 col-lg-6 col-xl-4">
                    <div className="row justify-content-center">
                        <div className="col-6 col-md-4 col-lg-5 col-xl-6 d-flex justify-content-end">
                            <Link className="btn_Espace_Professionnels" href="/professional_space">
                                <i className="fas fa-user-injured"></i> Professional Spaces
                            </Link>
                        </div>
                        <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
                            <Link className="btn_Espace_Patients" href="/patient_space">
                                <i className="fas fa-user-injured"></i> Patient Spaces
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav className="social">
    <ul>
        <li><Link href="#">Twitter <i className="fa fa-twitter twitter"></i></Link></li>
        <li><Link href="#">Linkedin <i className="fa fa-linkedin"></i></Link></li>
        <li><Link href="#">Google+ <i className="fa fa-google-plus"></i></Link></li>
        <li><Link href="#">Facebook <i className="fa fa-facebook"></i></Link></li>
    </ul>
</nav>
        <div className="container">
            <div className="row align-items-center">
                <div className="px-5 py-4 col-12 col-md-6 col-lg-6 formSearch" style={{background: "white", borderRadius: '7px'}}>
                    <h2 className="h2" style={{textAlign:'center'}}>Find your doctor and make an appointment or teleConsiel</h2>
                    <form className="py-5" onSubmit={handleSubmit}>
                    <div className="col-12">
                       
                       <div className="mb-4 input-icons">
                      
                               <select className="p-3 select"
                                     defaultValue="Choisir Un Medcine"
                                         >
                               <option  defaultValue="Choisir Un Medcine">Choose the name of Medcine</option>
                               { medcine && medcine.map((element,i:any)=>(
                                       <option key={i} value={element.fullName}>
                                      { element.fullName }
                                    </option>
                                     ))}
                               </select>
               
                           </div>
                           <div className="mb-4 input-icons">
                    
                               <select className="p-3 select"
                                        defaultValue="Choisir Une Spécialité"
                                        onChange={(e) => setSpeciality(e.target.value)}>
                                   <option  defaultValue="Choisir Une Spécialité" >Choose A Specialty</option>
                                   { medcine && medcine.map((item,indexSpeciality:any) =>(
                                           <option key={indexSpeciality} value={item.speciality}>
                                           { item.speciality }
                                         </option>
                                          ))}
                                 
                               </select>
                              
                           </div>
                           <div className="mb-4 input-icons">
                        
                               <select className="p-3 select"   
                                        defaultValue="Choisir Une Ville"
                                        >
                                   <option  defaultValue="Choisir Une Ville">Choose a city</option>
                                   { medcine && medcine.map((itemCity,index:any)=>(
                                           <option key={index} value={itemCity.city}>
                                           { itemCity.city }
                                         </option>
                                          ))}
                              
                               </select>
                           
                           </div>
                    
                       </div>
                        <div className="d-grid">
                            <button type="submit" className="py-3 button1">Search</button>
                        </div>
                    </form>
                </div>
                <div className="col-12 col-md-6 col-lg-6 ">
                   <Image alt=""  id="health" className="health-img" src={health} />
                </div>
            </div>
        </div>
    </section>
                
    <div className="py-5 container-fluid" style={{background: '#2CA5B8'}}>   
        <h3 className="text-center fw-bold fs-2" style={{color: 'white'}}>Why choose TATBIB Connect software ?</h3>
        <div className="py-3 row justify-content-center">
            <div className="text-center col-12 col-md-2">
               <Image alt=""  src={icon1}/>
                <span className="py-2 mb-0 text-center fw-bold fs-5" style={{color:"white"}}>Smart and ergonomic agenda</span>
            </div>
            <div className="text-center col-12 col-md-2">
               <Image alt=""  src={icon2}/>
                <span className="py-2 mb-0 text-center fw-bold fs-5" style={{color:"white"}}>Digital medical record</span>
            </div>
            <div className="text-center col-12 col-md-2">
               <Image alt=""  src={icon3}/>
                <span className="py-2 mb-0 text-center fw-bold fs-5" style={{color:"white"}}>TeleConsiel</span>
            </div>
            <div className="text-center col-12 col-md-2">
               <Image alt=""  src={icon4}/>
                <span className="py-2 mb-0 text-center fw-bold fs-5" style={{color:"white"}}>Highly secure access and data</span>
            </div>
        </div>
    </div>
    
    <div className="container py-5 cardMedcine">
        <h4 className="py-3 text-center fs-2 fw-bold" style={{color: '#2CA5B8'}}>Our practitioners</h4>
        
        <div className="row justify-content-evenly">
        { medcine && medcine.map((item:any) =>(
            <div key={item} className="m-2 text-center col-12 col-sm-6 col-md-2 " style={{ backgroundColor: '#E5E5E5', borderRadius: '20px',width:'30%' }}>                 
               <Image alt=""  src={Medicine} style={{width:'70%',height:'80%'}}/>
                <h4>{item.fullName}</h4>
                <h5>{item.speciality}</h5>
               
            </div>
        ))}
        </div>
    </div>
  
{/* ---------------------- start slide-----------------------  */}

{/* <div id="slider">
<input type="radio" name="slider" id="slide1" checked/>
<input type="radio" name="slider" id="slide2"/>
<input type="radio" name="slider" id="slide3"/>
<input type="radio" name="slider" id="slide4"/>
<div id="slides">
  <div id="overflow">
     <div className="inner">
     { medcine && medcine.map((item) =>(
        <div className="slide slide_1">           
           <div className="slide-content">
          <Image alt=""  src={Medicine} style={{width:'100%'}}/>
              <h2>{item.fullName}</h2>
              <span>{item.speciality}</span>
           </div>
       
        </div>
         ))}
     </div>
  </div>
</div>
<div id="controls">
  <label for="slide1"></label>
  <label for="slide2"></label>
  <label for="slide3"></label>
  <label for="slide4"></label>
</div>
<div id="bullets">
  <label for="slide1"></label>
  <label for="slide2"></label>
  <label for="slide3"></label>
  <label for="slide4"></label>
</div>
</div> */}



{/* ---------------------- end slide-----------------------  */}




<div className="nav-elements">


</div>        <div className="container">
        <div className="row align-items-center">
            <div className="col-12 col-md-6 col-lg-8">
                <h1 className="py-2">Together, s protect ourselves to limit the spread of the Coronavirus « COVID-19 »</h1>
                <span className="fs-4">Download Wiqaytna and help stop the spread of the virus.</span>
                <Link href= {{ pathname: "https://www.wiqaytna.ma/" }} target="_blank"   className="px-4 py-3 btn btn-primary fs-5" style={{background: '#1AA9E9', border: 'none', width:'215px',height:'50px',lineHeight:1}}>More information</Link>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
               <Image  src={wiqaytna} alt="" style={{width:'100%',height:'100%'}}/>
            </div>
        </div> 
    </div>
      <div className="footer">
        <div className="container">     
            <div className="row">                       
                <div className="col-lg-4 col-sm-4 col-xs-12">
                    <div className="single_footer">
                        <h4>The specialties</h4>
                        <ul>
                              <li><Link className="list-item" href="#">Cardiologist</Link></li>
                              <li><Link className="list-item" href="#">Dermatologist</Link></li>
                              <li><Link className="list-item" href="#">Gastroenterology</Link></li>
                              <li><Link className="list-item" href="#">Dentiste</Link></li>
                              <li><Link className="list-item" href="#">General Medicine</Link></li>
                        </ul>
                    </div>
                </div> 
                <div className="col-md-4 col-sm-4 col-xs-12">
                    <div className="single_footer single_footer_address">
                        <h4>Popular searches</h4>
                        <ul>
                              <li><Link className="list-item" href="#">General doctor in casablanca</Link></li>
                              <li><Link className="list-item" href="#">Dentiste doctor in casablanca</Link></li>
                              <li><Link className="list-item" href="#">Dentiste doctor in rabat</Link></li>
                              <li><Link className="list-item" href="#">Dentiste doctor in agadir</Link></li>
                              <li><Link className="list-item" href="#">Dentiste doctor in Marrakech</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12">
                    <div className="single_footer single_footer_address">
                        <h4>Subscribe today</h4>
                        <div className="signup_form">                           
                            <form action="#" className="subscribe">
                                <input type="text" className="subscribe__input" placeholder="Enter Email Address"/>
                                <button type="button" className="subscribe__btn"><i className="fa fa-paper-plane"></i></button>
                            </form>
                        </div>
                    </div>
                    <div className="social_profile">
                        <ul>
                            <li><Link href="#"><i className="fa fa-twitter twitter"></i></Link></li>
                            <li><Link href="#"><i className="fa fa-linkedin"></i></Link></li>
                            <li><Link href="#"><i className="fa fa-google-plus"></i></Link></li>
                            <li><Link href="#"><i className="fa fa-facebook"></i></Link></li>

                        </ul>
                    </div>                          
                </div>      
            </div>
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                    <span className="copyright"> © 2023 TATBIB.ma . All rights reserved <Link href="#" className="">Terms of Service</Link>.</span>
                </div>             
            </div>             
        </div>
    </div>
</div>

  )
}
