export interface Medicine {
  _id: string;
  fullName: string;
  speciality: string;
  city: string;
  availablity: string;
  login?: string; // Optional property
}
export type Appointment = {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
  };
  medicine: {
    fullName: string;
    speciality: string;
  };
  dateTime: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'Unconfirmed';
};
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


// In your component file
export interface Ordonnance {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    duration: string;
  }>;
  date: string;
}
