// utils/roles.ts
export const normalizeRole = (role: string): string => {
    if (!role) return "";
  
    const roleMap: Record<string, string> = {
      "medcine": "medicine",
      "Medcine": "medicine",
      "médecin": "medicine",
      "secretary": "secretary",
      "Secretary": "secretary",
      "patient": "patient",
      "Patient": "patient"
    };
  
    return roleMap[role] || role.toLowerCase();
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