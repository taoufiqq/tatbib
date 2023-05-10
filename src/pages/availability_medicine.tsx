import Image from 'next/image'
import { useRouter } from 'next/router'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '@/components/withPrivateRoute';

 const ManagementAvailablityMedcine = () => {
  
    const router = useRouter();

  const [availablity, setAvailablity] = useState("");
  const [updatedAvailablity, setUpdatedAvailablity] = useState("");
  const id =localStorage.getItem('id_medcine')

  useEffect(()=>{

    axios.get(`https://tatbib-api.onrender.com/medcine/getMedcineById/${id}`)
    .then(function (response) {
     
        setAvailablity(response.data.availablity)
    }).catch(function (err) {
      console.log(err);
  });
  
  })

  const handleSubmit = (e:any) => {
    e.preventDefault();

    const data = {availablity:updatedAvailablity};

  axios.put(`https://tatbib-api.onrender.com/medcine/updateAvailablityMedcine/${id}`,data)
  .then(res => {
    if(!res.data){
      return false
    }else{
      toast.success('authenticated SuccessFully', { position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "colored", })    
      router.push('/medicine_dashboard');
    }
   
  })
  
  }

    return ( 
        <div className="Containerr" style={{overflow: 'hidden'}}>

  <main>
 
  <div className="table">
  <div className="table-wrapper">
    <div className="table-title">
      <div className="row">
        <div className="col-sm-5">
          <h2>Medcine <b>Management Availablity</b></h2>
        </div>
      </div>
    </div>
  </div>
</div>
 <div className="col-12 col-md-6 col-lg-6 px-5 py-4 ConfirmForm">
<h2 className="h2">Update Availablity</h2>
<form  onSubmit={handleSubmit}>
    <div className="col-12">
        <div className="input-icons mb-4">
           <select className="select p-3"
               value={updatedAvailablity}
               onChange={(e) => setUpdatedAvailablity(e.target.value)}>
                <option selected value={updatedAvailablity}>Choose your Availablity</option>
                <option value="Available">Available</option>
                <option value="NotAvailable">NotAvailable</option>
            </select>
        </div>
    </div>
    <div className="d-grid">
        <button type="submit" className="button1 py-3">
          Confirm
          <ToastContainer />
        </button>
    </div>
</form>
</div> 
  </main>
</div>
     );
}
export default withAuth(ManagementAvailablityMedcine)






