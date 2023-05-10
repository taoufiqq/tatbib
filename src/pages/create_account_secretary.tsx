import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/images/logo.png'
import { Secretary } from "@/types";

export default function CreateAccountSecretary() {

    // var Medecin = JSON.parse(localStorage.getItem('medcine'));
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    // const id=localStorage.getItem('id_medcine');  
  

//---------add admin------------- 

const handleSubmit = (e:any) => {
    e.preventDefault();

    if (typeof window !== 'undefined') {
        // Perform localStorage action
        const LoginMedcine=localStorage.getItem('LoginMedcine') || ""; 
   
        const Secretary = {fullName,email,password,login,loginMedcine:LoginMedcine};
        axios.post(`https://tatbib-api.onrender.com/medcine/createAccountSecretary`,Secretary)
      
    .then(res => {
        if(!res.data.message){
            router.push('/account_secretary')   
        }else{
          console.log(res.data);
         }
     
    })
    }

}
 
  return (

        <section className="header-page">
            <div className="container">
            <div className="row justify-content-between py-3 align-items-center">
                    <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
                     <Link href="/"><Image alt="" src={logo} width="100"/></Link>
                    </div>
                  
                </div>
           <div className="card EspacePatient">
          <div className="row ">
          <div>
           <form className="row"  method="#" action="#" onSubmit={handleSubmit}>
           <label className="form-label" style={{marginTop:'4%'}}>Create Compte Secretary</label>
             <div className="fromloginSignUp" style={{marginTop:'10%'}}>
             <div className="row ">
             <div className="col-md-6">
                 <input  type="text" placeholder="FullName" className="form-control" id="fullName" required    
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}/>
             </div>
             <div className="col-md-6">
                 <input  type="text" placeholder="Email" className="form-control" id="email"  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}/>
            </div>
            </div>
            <div className="row ">
             <div className="col-md-6">
                   <input type="text"  className="form-control" id="login" placeholder="login"  
                    value={login}
                    onChange={e => setLogin(e.target.value)} /> 
               
            </div>
             <div className="col-md-6">
                 <input type="password" placeholder="Password" className="form-control " id="password"  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}/>
             </div>
             </div>

         
             </div>
             <div>
                 <input type="submit"  className="form-control mt-5 btnConnect" id="signup" value="Confirm"/>
         
             </div>
           </form>
           </div>
           </div>
           </div>
         </div>
     </section>

    )
}
