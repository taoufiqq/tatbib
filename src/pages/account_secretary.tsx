import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/images/doctor.png'
import { Secretary } from "@/types";

export default  function SecretaryCompte () {
  
  const router = useRouter();

  // const [secretary, setSecretary] = useState();
  // const login = localStorage.getItem('LoginMedcine') || " "

    const [listSecretary, setListSecretary] = useState<Secretary[] | null>(null);
    if (typeof window !== 'undefined') {

    const loginMedcine=localStorage.getItem('LoginMedcine')|| " "; 

    axios.get(`https://tatbib-api.onrender.com/medcine/getSecretaryByMedcineName/${loginMedcine}`)
    .then(function (response) {
        
      setListSecretary(response.data)
    }).catch(function (err) {
      console.log(err);
  });




    const getIdSecretary = (id:any)=>{
      localStorage.setItem('idSecretary',id);
      router.push('/management_account_secretary');
    
    }


  // delete My Account  
  const deleteAccountSecretary = (id:any)=>{
    var msgConfirmation = window.confirm("Are You Sure Yo want to delete this Account ?");
    if (msgConfirmation) {   
    axios.delete(`https://tatbib-api.onrender.com/medcine/deleteSecretary/${id}`)
    .then(function (response) {
        window.location.reload();
      console.log('item was deleted Succesfully ... ');
    //   toastr.success(' Account was deleted SuccessFully')
    
    })
    
  
  }
}




//-----------------------log out-----------------
  const logOut =()=>{
    localStorage.clear()
       router.push('/login_medicine');
       toast.success('Log out SuccessFully', { position: "top-left",
       autoClose: 5000,
       hideProgressBar: false,
       closeOnClick: false,
       pauseOnHover: false,
       draggable: false,
       progress: undefined,
       theme: "colored", })   
    }



    return ( 
        <div className="Container">
 
  <nav className="menu" tabIndex={0}>
    <div className="smartphone-menu-trigger" />
    <header className="avatar">
      <Image alt="" src={logo}  />
      <h6>Welcome</h6>
      <h5 style={{color:'white'}}>{loginMedcine}</h5>
    </header>
    <ul>
    <li tabIndex={0} className="icon-profil"><Link href='/medicine_dashboard' style={{textDecoration:"none",color:"white"}}><span>MyAccount</span></Link></li>
      <li tabIndex={0} className="icon-customers"><Link href='/list_appointments_medicine' style={{textDecoration:"none",color:"white"}}><span>ListAppointments</span></Link></li>
      <li tabIndex={0} className="icon-users"><Link href='/ordonnances_by_medicine' style={{textDecoration:"none",color:"white"}}><span>Ordonnances</span></Link></li>
      <li tabIndex={0} className="icon-Secrétaire"><Link href='/account_secretary' style={{textDecoration:"none",color:"white"}}><span>Secretary</span></Link></li>
      <li tabIndex={0} className="icon-settings"><span onClick={logOut}>Log out</span><ToastContainer/></li>
    </ul>
  </nav>
  <main>
  <div className="helper">
         Secretary Account<span> Secretary | Management</span>
    </div>
  <div className="table-responsive">
  <div className="table-wrapper">
  <div className="table-title">
      <div className="row">
        <div className="col-sm-5">
        <h2>Account <b>Management</b></h2>
        </div>
        <div className="col-sm-7">
        <Link href="/create_account_secretary" className="btn btn-secondary"><i className="material-icons"></i> <span>Add New Secretary</span></Link>

        </div>
      </div>
    </div>
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>FullName</th>						
          <th>Email</th>
          <th>Login</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      { listSecretary && listSecretary.map((item:any,index:number) =>(
      <tbody key={index}>
        <tr>
          <td>{item.fullName}</td>
          <td>{item.email}</td>  
          <td>{item.login}</td>                 
          <td  style={{color: item.status !== "InActive"?'color': 'red'}}><span className="status text-danger"></span>{item.status}</td>
          <td>
            <Link href="" onClick={()=>getIdSecretary(item._id)} className="edit" title="Active Account Secretary" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></Link>
            <Link href="" onClick={()=>deleteAccountSecretary(item._id)} className="delete" title="Delete Account Secretary" data-toggle="tooltip"><i className="material-icons">&#xE872;</i></Link>
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
}

