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

const AccountPatient = () => {
  
  const router = useRouter();
//   const [medcine, setMedcine] = useState();
 const loginPatient =localStorage.getItem('LoginPatient')
 const id =localStorage.getItem('id_patient')
 const [firstName, setFirstName] = useState();
 const [lastName, setLastName] = useState();
 const [login, setLogin] = useState();
 const [age, setAge] = useState();
 const [telephone, setTelephone] = useState();
 const [email, setEmail] = useState();


 useEffect(()=>{

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
  
  },[id])


  const getIdPatient = (id:any)=>{
    localStorage.setItem('id_patient',id);
    router.push('/update_my_account');
  
  }

  // delete My Account  
  const deleteAccount = (id:any)=>{
    var msgConfirmation = window.confirm("Are You Sure Yo want to delete this Account ?");
    if (msgConfirmation) {   
    axios.delete(`https://tatbib-api.onrender.com/patient/deletePatient/${id}`)
    .then(function (response) {
        window.location.reload();
      console.log('item was deleted Succesfully ... ');
      toast('Account deleted SuccessFully', { hideProgressBar: true, autoClose: 2000, type: 'success' ,position:'top-right' })    
    
    })
    
  
  }
}




//-----------------------log out-----------------
  const logOut =()=>{
    localStorage.clear()
       router.push('/login_patient');
       toast('Log out SuccessFully', { hideProgressBar: true, autoClose: 2000, type: 'success' ,position:'top-right' })    
    }



    return ( 
        <div className="Container" style={{overflow: 'hidden'}}>
 
  <nav className="menu" tabIndex={0}>
    <div className="smartphone-menu-trigger" />
    <header className="avatar">
    <Image alt="" src={logo} style={{borderRadius:'50%'}} />
      <h6>Welcome</h6>
      <h5 style={{color:'white'}}>{loginPatient}</h5>
    </header>
    <ul>
      <li tabIndex={0} className="icon-customers"><Link href='/patient_dashboard' style={{textDecoration:"none",color:"white"}}><span>Appointment</span></Link></li>
      <li tabIndex={0} className="icon-users"><Link href='/listOrdonnancesPatient' style={{textDecoration:"none",color:"white"}}><span>Ordonnances</span></Link></li>
      <li tabIndex={0} className="icon-profil"><Link href='/account_patient' style={{textDecoration:"none",color:"white"}}><span>MyAccount</span></Link></li>
      <li tabIndex={0} className="icon-settings"><span onClick={logOut}>Log out</span><ToastContainer /></li>
    </ul>
  </nav>
  <main>
  <div className="helper">
          My Account<span> Management | Account</span>
    </div>
  <div className="table-responsive">
  <div className="table-wrapper">
    <div className="table-title">
      <div className="row">
        <div className="col-sm-5">
          <h2>Account <b>Management</b></h2>
        </div>
      </div>
    </div>
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>FirstName</th>		
          <th>LastName</th>	          
          <th>Login</th>
          <th>Age</th>
          <th>Telephone</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      {/* { medcine && medcine.map(item =>( */}
      <tbody>
        <tr>
      
          <td>{firstName}</td>
          <td>{lastName}</td>  
          <td>{login}</td>  
          <td>{age}</td>
          <td>{telephone}</td>                          
          <td>{email}</td>
          <td>
            <Link href="" onClick={()=>getIdPatient(id)} className="edit" title="Edit Account" data-toggle="tooltip"><i className="material-icons">&#xE254;</i><ToastContainer /></Link>
            <Link href="" onClick={()=>deleteAccount(id)} className="delete" title="Delete Account" data-toggle="tooltip"><i className="material-icons">&#xE872;</i><ToastContainer /></Link>
          </td>
        </tr>

      </tbody>
         {/* ))} */}
    </table>
  </div>
</div>
  </main>
</div>
     );
}

export default withAuth(AccountPatient)