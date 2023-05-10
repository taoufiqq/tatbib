import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/images/doctor.png'
import withAuth from '@/components/withPrivateRoute';
import moment from 'moment';
import { Appointment } from '@/types';

const ListAppointments = () => {

    const login =localStorage.getItem('LoginMedcine');
    const id =localStorage.getItem('id_medcine')
  const router = useRouter();


  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(null);




  useEffect(()=>{

    axios.get(`https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`)
    .then(function (response) {
     
      setListAppointment(response.data)
    }).catch(function (err) {
      console.log(err);
  });
  
  },[id])

  const getIdAppointment = (id:any)=>{
    localStorage.setItem('idAppointment',id);
    router.push('/create_ordonnance');
  }
  const getIdPatient = (id:any)=>{
    localStorage.setItem('id_patient',id);
    router.push('/create_ordonnance');
  
  }
  const logOut =()=>{
    localStorage.clear()
       router.push('/login_medicine');
    }



    return ( 
        <div className="Container">
 
  <nav className="menu" tabIndex={0}>
    <div className="smartphone-menu-trigger" />
    <header className="avatar">
    <Image alt="" src={logo} style={{borderRadius:'50%'}} />
      <h6>Welcome</h6>
      <h5 style={{color:'white'}}>{login}</h5>
    </header>
    <ul>
      <li tabIndex={0} className="icon-profil"><Link href='/medicine_dashboard' style={{textDecoration:"none",color:"white"}}><span>MyAccount</span></Link></li>
      <li tabIndex={0} className="icon-customers"><Link href='/list_appointments_medicine' style={{textDecoration:"none",color:"white"}}><span>ListAppointments</span></Link></li>
      <li tabIndex={0} className="icon-users"><Link href='/ordonnances_by_medicine' style={{textDecoration:"none",color:"white"}}><span>Ordonnances</span></Link></li>
      <li tabIndex={0} className="icon-Secrétaire"><Link href='/account_secretary' style={{textDecoration:"none",color:"white"}}><span>Secretary</span></Link></li>
      <li tabIndex={0} className="icon-settings"><span onClick={logOut}>Log out</span></li>
    </ul>
  </nav>
  <main>
    <div className="helper">
         Appointemnt<span> Appointemnts | List</span>
    </div>
    {/* <p className="listRDV">Appointemnt list</p> */}
    <div className="table-responsive">
  <div className="table-wrapper">
  <div className="table-title">
      <div className="row">
        <div className="col-sm-5">
          <h2>Appointemnts <b>list</b></h2>
        </div>
        {/* <div className="col-sm-7">
          <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Add New User</span></a>
          <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Export to Excel</span></a>						
        </div> */}
      </div>
    </div>
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>LastName</th>	
          <th>FirstName</th>
          <th>email</th>	
          <th>telephone</th>	
          <th>Date</th>
          <th>Time</th>	          	          
          <th>status</th>
          <th>Ordonnance</th>
        </tr>
      </thead>
      { listAppointment && listAppointment.map((item:any,index:any) =>(
   
      <tbody key={index}>
        <tr>
          <td>{item.patient.firstName}</td>
          <td>{item.patient.lastName}</td>
          <td>{item.patient.email}</td>
          <td>{item.patient.telephone}</td>
          <td>{moment(item.dateTime).format(`MMMM DD YYYY`)}</td>
          <td>{moment(item.dateTime).format(`HH:MM`)}</td>
          <td style={{color: item.status !== "Unconfirmed"?'color': 'red'}}>{item.status}</td>


          <td>
            <Link href="" onClick={() => { getIdAppointment(item._id); getIdPatient(item.patient._id);}} className="confirm" title="Writing a Ordonnance" data-toggle="tooltip" style={{visibility:  item.status !== "Unconfirmed"?'visible':'hidden'}}><i className="material-icons border_color">&#xe22b;</i></Link>
          </td>
        </tr>

      </tbody>
       ))} 
    </table>
  </div>
</div>

  </main>
</div>
     );
}

export default withAuth(ListAppointments);