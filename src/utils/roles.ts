export const ROLES = {
  PATIENT: "patient",
  MEDICINE: "medicine",
  SECRETARY: "secretary",
} as const;

export type AuthRole = (typeof ROLES)[keyof typeof ROLES];
