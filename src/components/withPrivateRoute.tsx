import Home from "@/pages";
import LoginMedcine from "@/pages/login_medicine";
import LoginPatient from "@/pages/login_patient";

const withAuth = (Component:any) => {
  const Auth = (props:any) => {
    // Login data added to props via redux-store (or use react context for example)
    const { isLoggedIn } = props;
//     const isMedcineAuthenticated = () => {
//       const token =  localStorage.getItem('token');
//       const role =  localStorage.getItem('role');
//       const Medcine= JSON.parse(localStorage.getItem('medcine') || "");
  
//       if(token && role === "Medcine" && Medcine._id){
//           return token
//       }
  
//       return false
//   }
  const isPatientAuthenticated = () => {
    const token =  localStorage.getItem('tokenPatient');
    const role =  localStorage.getItem('rolePatient');
    if(token && role === "Patient"){
        return token
    }

    return false
}

    // If user is not logged in, return login component
    if (!isLoggedIn && !isPatientAuthenticated) {
      return (
        <Home/>
      );
    }


    // If user is logged in, return original component
    return (
      <Component {...props} />
    );
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;