export interface Medc {
    fullName? : string,
    email : string,
    login : string,
    password : string,
    city : string,
    speciality : string
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

  export interface Appointment {
    dateTime : string,
    status : string,
    medcine : Medc,
    patient : Patient
  }
  export interface Ordonnance {
    medicamment : string,
    appointment : Appointment,
    medcine : Medc,
    patient : Patient
  }