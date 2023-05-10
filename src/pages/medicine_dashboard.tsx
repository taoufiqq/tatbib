import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/images/doctor.png'
import withAuth from '@/components/withPrivateRoute';


const DashboardMedcine = () => {
  
    const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [city, setCity] = useState("");
  const [availablity, setAvailablity] = useState("");
  const [login, setLogin] = useState("");

  // console.log(Medecin);

  useEffect(()=>{
    const id = localStorage.getItem('id_medcine') || '{}';

    axios.get(`https://tatbib-api.onrender.com/medcine/getMedcineById/${id}`)
      .then(function (response) {
          
        setFullName(response.data.fullName)
        setEmail(response.data.email)
        setSpeciality(response.data.speciality)
        setCity(response.data.city)
        setAvailablity(response.data.availablity)
        setLogin(response.data.login)
        console.log(response.data);
      
      }).catch(function (err) {
        console.log(err);
    });
    
    },[])



  const getIdMedecin = (id:string)=>{
    localStorage.setItem('id_medcine',id);
    router.push('/availability_medicine');
  
  }
  if (typeof window !== 'undefined') {
    var medecin = JSON.parse(localStorage.getItem('medcine') || '{}');
    const login_Medcine  = localStorage.getItem("LoginMedcine") || ""



//-----------------------log out-----------------
  const logOut =()=>{
    localStorage.clear()
    router.push('/login_medicine');
    toast.success('Log out SuccessFully', { 
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "colored", })    

    }



    return ( 
        <div className="Container" style={{overflow: 'hidden'}}>
 
  <nav className="menu" tabIndex={0}>
    <div className="smartphone-menu-trigger" />
    <header className="avatar">
      <Image alt="" src={logo}  />
      <h6>Welcome</h6>
      <h5 style={{color:'white'}}>{login_Medcine}</h5>
    </header>
    <ul>
    <li tabIndex={0} className="icon-profil"><Link href='/medicine_dashboard' style={{textDecoration:"none",color:"white"}}><span>MyAccount</span></Link><ToastContainer /></li>
      <li tabIndex={0} className="icon-customers"><Link href='/list_appointments_medicine' style={{textDecoration:"none",color:"white"}}><span>ListAppointments</span></Link><ToastContainer /></li>
      <li tabIndex={0} className="icon-users"><Link href='/ordonnances_by_medicine' style={{textDecoration:"none",color:"white"}}><span>Ordonnances</span></Link></li>
      <li tabIndex={0} className="icon-Secrétaire"><Link href='/account_secretary' style={{textDecoration:"none",color:"white"}}><span>Secretary</span></Link><ToastContainer /></li>    
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
          <th>FullName</th>						
          <th>Email</th>
          <th>Login</th>
          <th>Speciality</th>
          <th>City</th>
          <th>Availablity</th>
          <th>Action</th>
        </tr>
      </thead>
      {/* { medcine.map(item =>( */}
      <tbody>
        <tr>
          <td>{fullName}</td>
          <td>{email}</td>  
          <td>{login}</td>
          <td>{speciality}</td>
          <td>{city}</td>                   
          <td style={{color: availablity !== "NotAvailable"?'color': 'red'}}><span className="status text-success"></span>{availablity}</td>
          <td>
            <Link href="" onClick={()=>getIdMedecin(medecin._id)} className="edit" title="Edit Account" data-toggle="tooltip" ><i className="material-icons">&#xE254;</i></Link>
            <Link href="" className="delete" title="Delete Account" data-toggle="tooltip"><i className="material-icons">&#xE872;</i></Link>
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
}
export default withAuth(DashboardMedcine);
