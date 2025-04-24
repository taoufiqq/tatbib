import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/images/doctor.png'
import withAuth from '@/components/withPrivateRoute';
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";

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
      <div className="Container" style={{ overflow: 'hidden' }}>
        {/* Navigation Menu */}
        <nav className="menu" tabIndex={0}>
          <div className="smartphone-menu-trigger" />
          <header className="avatar">
            <Image alt="Logo" src={logo} style={{ borderRadius: '50%', width: '150px' }} />
            <h6>Welcome</h6>
            <h5 style={{ color: 'white' }}>{login_Medcine}</h5>
          </header>
  
          {/* Navigation Links */}
          <ul>
            <li tabIndex={0} className="icon-customers">
              <MdDashboard />
              <Link href="/list_appointments_medicine" style={{ textDecoration: 'none', color: 'white' }}>
                <span>List Appointments</span>
              </Link>
              <ToastContainer />
            </li>
            <li tabIndex={0} className="icon-profil">
              <FaUserEdit />
              <Link href="/medicine_dashboard" style={{ textDecoration: 'none', color: 'white' }}>
                <span>My Account</span>
              </Link>
              <ToastContainer />
            </li>
            <li tabIndex={0} className="icon-users">
              <FaNotesMedical />
              <Link href="/ordonnances_by_medicine" style={{ textDecoration: 'none', color: 'white' }}>
                <span>Ordonnances</span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-Secrétaire">
              <FaUserPlus />
              <Link href="/account_secretary" style={{ textDecoration: 'none', color: 'white' }}>
                <span>Secretary</span>
              </Link>
              <ToastContainer />
            </li>
            <li tabIndex={0} className="icon-settings">
              <RiLogoutCircleFill />
              <span onClick={logOut}>Log out</span>
              <ToastContainer />
            </li>
          </ul>
        </nav>
  
        {/* Main Content */}
        <main>
          <div className="helper">
            My Account <span> Management | Account</span>
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
  
              {/* Table */}
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>FullName</th>
                    <th>Email</th>
                    <th>Login</th>
                    <th>Speciality</th>
                    <th>City</th>
                    <th>Availability</th>
                    <th>Action</th>
                  </tr>
                </thead>
  
                <tbody>
                  <tr>
                    <td>{fullName}</td>
                    <td>{email}</td>
                    <td>{login}</td>
                    <td>{speciality}</td>
                    <td>{city}</td>
                    <td style={{ color: availablity !== 'NotAvailable' ? 'green' : 'red' }}>
                      <span className="status text-success"></span>{availablity}
                    </td>
                    <td>
                      <Link href="" onClick={() => getIdMedecin(medecin._id)} className="edit" title="Edit Account">
                        <i className="material-icons">&#xE254;</i>
                      </Link>
                      <Link href="" className="delete" title="Delete Account">
                        <i className="material-icons">&#xE872;</i>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
export default withAuth(DashboardMedcine);
