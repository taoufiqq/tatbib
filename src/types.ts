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

export type Appointment = {
  _id: string
  patient: {
    lastName: string
    firstName: string
    email: string
    telephone: string
  }
  dateTime: string
  status: string
  // Add other necessary fields
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
