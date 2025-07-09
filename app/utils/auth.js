export function isLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true"
}

export function login(nombre: string) {
  localStorage.setItem("isLoggedIn", "true")
  localStorage.setItem("usuario", nombre)
}

export function logout() {
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("usuario")
}