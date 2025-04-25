export const normalizeRole = (role: string): string => {
  if (!role) return "";

  const roleMap: Record<string, string> = {
    medcine: "medicine",
    Medcine: "medicine",
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

export type AuthRole = (typeof ROLES)[keyof typeof ROLES];
