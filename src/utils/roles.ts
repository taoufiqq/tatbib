// Fixed roles utility with better error handling

export const normalizeRole = (role: string): string => {
  if (!role) return "";

  const roleMap: Record<string, string> = {
    // Fixed typo "medcine" -> "medicine"
    medicine: "medicine",
    medcine: "medicine", // Common typo handling
    Medcine: "medicine",
    médecin: "medicine",
    secretary: "secretary",
    Secretary: "secretary",
    patient: "patient",
    Patient: "patient",
  };

  return roleMap[role] || role.toLowerCase();
};

export const ROLES = {
  MEDICINE: "medicine",
  SECRETARY: "secretary",
  PATIENT: "patient",
} as const;

export type AuthRole = (typeof ROLES)[keyof typeof ROLES]; // "medicine" | "secretary" | "patient"
export type AuthRoleKey = keyof typeof ROLES; // "MEDICINE" | "SECRETARY" | "PATIENT"

export const getRoleTokens = (
  role: AuthRole
): { tokenKey: string; loginKey: string; idKey: string } => {
  // Validate role to prevent errors
  if (!role || typeof role !== "string") {
    console.error(`Invalid role provided to getRoleTokens: ${role}`);
    // Default to secretary to prevent crashes, but log the error
    return {
      tokenKey: "tokenSecretary",
      loginKey: "LoginSecretary",
      idKey: "id_secretary",
    };
  }

  // Normalize the role to handle potential case issues
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case ROLES.MEDICINE:
      return {
        tokenKey: "tokenMedicine",
        loginKey: "LoginMedicine",
        idKey: "id_medicine",
      };
    case ROLES.SECRETARY:
      return {
        tokenKey: "tokenSecretary",
        loginKey: "LoginSecretary",
        idKey: "id_secretary",
      };
    case ROLES.PATIENT:
      return {
        tokenKey: "tokenPatient",
        loginKey: "LoginPatient",
        idKey: "id_patient",
      };
    default:
      console.error(`Unsupported role: ${role}, defaulting to secretary`);
      return {
        tokenKey: "tokenSecretary",
        loginKey: "LoginSecretary",
        idKey: "id_secretary",
      };
  }
};
