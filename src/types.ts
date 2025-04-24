export interface Medicine {
  _id: string;
  fullName: string;
  speciality: string;
  city: string;
  availablity: string;
  login?: string; // Optional property
}

  export interface Patient {
    firstName : string,
    lastName : string,
    age : number,
    telephone : number,
    email : string,
    login : string,
    password : string
  }

  export interface Secretary {
    fullName : string,
    email : string,
    login : string,
    password : string,
    status : string,
    loginMedcine : string,
    roleSecretary : string
  }

  interface AppointmentData {
    dateTime: string;
    medcine: string;
    patient: string;
    loginMedcine?: string;
  }
  
  interface ApiResponse {
    _id?: string;
    error?: boolean;
    message?: string;
  }
  export interface Ordonnance {
    medicamment : string,
    appointment : AppointmentData,
    medcine : Medicine,
    patient : Patient
  }