export function getAuthToken(): string | null {
  return localStorage.getItem("trueconcept_token");
}
