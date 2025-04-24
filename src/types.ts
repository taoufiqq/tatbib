export interface Medicine {
  _id: string;
  fullName: string;
  speciality: string;
  city: string;
  availablity: string;
  login?: string; // Optional property
}

export interface Patient {
  firstName: string;
  lastName: string;
  age: number;
  telephone: number;
  email: string;
  login: string;
  password: string;
}

export interface Secretary {
  fullName: string;
  email: string;
  login: string;
  password: string;
  status: string;
  loginMedcine: string;
  roleSecretary: string;
}

export interface Appointment {
  _id?: string;
  dateTime: string;
  medcine: {  // Change from string to object type
    fullName: string;
    speciality: string;
    // Add other medcine properties as needed
  };
  patient: string;
  loginMedcine?: string;
  status: string;
}
export interface Ordonnance {
  medicamment: string;
  appointment: Appointment;
  medcine: Medicine;
  patient: Patient;
}
