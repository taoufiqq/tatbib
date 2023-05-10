import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
// import { format } from 'date-fns'
import logo from '../../public/images/user.jpg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Appointment } from '@/types'
import withAuth from '@/components/withPrivateRoute';


 const UpdateAccountPatient =()=> {
  
  const router = useRouter();


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [age, setAge] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");

 
  useEffect(()=>{
    const id =localStorage.getItem('id_patient')
   axios.get(`https://tatbib-api.onrender.com/patient/getPatientById/${id}`)
     .then(function (response) {
         
       setFirstName(response.data.firstName)
       setLastName(response.data.lastName)
       setLogin(response.data.login)
       setAge(response.data.age)
       setTelephone(response.data.telephone)
       setEmail(response.data.email)

       console.log(response.data);
     
     }).catch(function (err) {
       console.log(err);
   });
   
   },[])

   const handleSubmit = (e:any) => {
		e.preventDefault();


    const id =localStorage.getItem('id_patient')

    const data = {firstName,lastName,login,age,telephone,email};

	axios.put(`https://tatbib-api.onrender.com/patient/updatePatient/${id}`,data)
    .then(res => {
    if(res.data.message){
      return false
    }else{
      console.log(res.data);
      router.push('/account_patient')
      toast.success('Your Account Updated successfully', { position: "top-right",
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

  <main className="header-page">
 
  <div className="table">
  <div className="table-wrapper">
    <div className="table-title">
      <div className="row">
        <div className="col-sm-5">
          <h2>My Account <b>Management Account</b></h2>
        </div>
      </div>
    </div>

  </div>
</div>
 <div className="col-12 col-md-6 col-lg-6 px-5 py-4 ConfirmForm">
<h2 className="h2" style={{marginTop:"8%",paddingBottom:"8%"}}>Update My Account</h2>
<form onSubmit={handleSubmit}>
<div className="fromloginSignUp">
             <div className="row ">
             <div className="col-md-6">
                 <input  type="text" placeholder="FirstName" className="form-control" id="FirstName" required    
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  />
             </div>
            <div className="col-md-6">
                 <input  type="text" placeholder="LastName" className="form-control" id="LastName" required  
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  />
            </div>
            </div>
            <div className="row ">
            <div className="col-md-6">
                 <input  type="text" placeholder="Age" className="form-control" id="age"  required  
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  />
             </div>
             <div className="col-md-6">
                 <input  type="text"  placeholder="Télephone" className="form-control" id="tel"  required  
                 value={telephone}
                 onChange={e => setTelephone(e.target.value)}
                 />
            </div>
            </div>
            <div className="row ">
             <div className="col-md-6">
                 <input  type="text" placeholder="Email" className="form-control" id="email"  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  />
            </div>
             <div className="col-md-6">
             <input type="text"  className="form-control" id="login" placeholder="login"  
                    value={login}
                    onChange={e => setLogin(e.target.value)} 
                    /> 
             </div>
             </div>
               
         
             </div>
            
    <div className="d-grid">
        {/* <button type="submit" class="button1 py-3">Confirmer</button> */}
        <input type="submit"  className="form-control mt-5 btnConnect" id="signup" value="confirm"/>
    </div>
</form>
</div> 
  </main>
</div>
     );
}
export default withAuth(UpdateAccountPatient)






