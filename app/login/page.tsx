"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "../back/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")

  // Datos comunes
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")

  // Datos solo para registro
  const [cedula, setCedula] = useState("")
  const [limiteDeEgresos, setLimiteDeEgresos] = useState("")

  // 🔐 Redirige si ya estás autenticado
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/tipos-ingresos")
    }
  }, [router])

  const handleLogin = async () => {
    setError("")
    const { data, error: dbError } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("Nombre", nombre)
      .eq("password", password)

    if (dbError) {
      setError("Error al conectar con la base de datos.")
      return
    }

    if (data && data.length === 1) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("usuario", nombre)

      // 🔥 Notifica al sidebar que hubo login
      window.dispatchEvent(new Event("loginStatusChanged"))

      router.push("/tipos-ingresos")
    } else {
      setError("Nombre o contraseña incorrectos.")
    }
  }

  const handleRegister = async () => {
    setError("")
    if (!nombre || !password || !cedula || !limiteDeEgresos) {
      setError("Por favor, completa todos los campos.")
      return
    }

    const fechaActual = new Date()
    const fechaFormateada = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${fechaActual.getDate().toString().padStart(2, "0")}`

    const { error: insertError } = await supabase.from("Usuarios").insert([
      {
        Nombre: nombre,
        Cedula: parseInt(cedula),
        LimiteDeEgresos: parseInt(limiteDeEgresos),
        FechaDeCorte: fechaFormateada,
        Estado: true,
        password: password,
      },
    ])

    if (insertError) {
      setError("Error al registrar el usuario.")
    } else {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("usuario", nombre)
      window.dispatchEvent(new Event("loginStatusChanged"))
      router.push("/tipos-ingresos")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>{isRegistering ? "Registro de Usuario" : "Inicio de Sesión"}</CardTitle>
          <CardDescription>
            {isRegistering ? "Crea tu cuenta para comenzar" : "Accede con tus credenciales"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <Label htmlFor="cedula">Cédula</Label>
                <Input
                  id="cedula"
                  type="number"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="limite">Límite de Egresos</Label>
                <Input
                  id="limite"
                  type="number"
                  value={limiteDeEgresos}
                  onChange={(e) => setLimiteDeEgresos(e.target.value)}
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button className="w-full" onClick={isRegistering ? handleRegister : handleLogin}>
            {isRegistering ? "Registrarse" : "Iniciar Sesión"}
          </Button>

          <p className="text-sm text-center">
            {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 hover:underline"
            >
              {isRegistering ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
