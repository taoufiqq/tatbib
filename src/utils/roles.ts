export const normalizeRole = (role: string): string => {
    if (!role) return "";
  
    const roleMap: Record<string, string> = {
      "medcine": "medicine",
      "Medcine": "medicine",
      "médecin": "medicine", // French variant
      "secretary": "secretary", 
      "Secretary": "secretary",
      "secrétaire": "secretary", // French variant
      "patient": "patient",
      "Patient": "patient"
    };
  
    // First try exact match, then lowercase match, then return lowercase
    return roleMap[role] || roleMap[role.toLowerCase()] || role.toLowerCase();
  };
  
  export const ROLES = {
    MEDICINE: "medicine",
    SECRETARY: "secretary",
    PATIENT: "patient"
  } as const;
  
  export type AuthRole = typeof ROLES[keyof typeof ROLES];
  
  export const getRoleTokens = (role: AuthRole) => {
    switch (role) {
      case ROLES.MEDICINE:
        return { tokenKey: "tokenMedicine", loginKey: "LoginMedicine", idKey: "id_medcine" };
      case ROLES.SECRETARY:
        return { tokenKey: "tokenSecretary", loginKey: "LoginSecretary", idKey: "id_secretary" };
      case ROLES.PATIENT:
        return { tokenKey: "tokenPatient", loginKey: "LoginPatient", idKey: "id_patient" };
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  };