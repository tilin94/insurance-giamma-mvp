"use client"

import { useAuth } from "@/contexts/auth-context"
import { usePack } from "@/contexts/pack-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, Phone, Upload, Users, BarChart3, Activity } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PackSelector } from "./pack-selector"

export function Navigation() {
  const { user, logout } = useAuth()
  const { hasFeature } = usePack()
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <PackSelector />

            {user && (
              <div className="flex items-center space-x-4">
                <Link
                  href="/contactacion"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/contactacion"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  <span>Contactación</span>
                </Link>

                {hasFeature("vendedores") && (
                  <Link
                    href="/vendedores"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === "/vendedores"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Vendedores</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {hasFeature("reportes") && (
                  <Link
                    href="/reportes"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === "/reportes"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Reportes</span>
                  </Link>
                )}

                {hasFeature("auditoria") && (
                  <Link
                    href="/auditoria"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === "/auditoria"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Activity className="h-4 w-4" />
                    <span>Auditoría</span>
                  </Link>
                )}

                {hasFeature("cargar-datos") && (
                  <Link
                    href="/cargar-datos"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === "/cargar-datos" || pathname === "/"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Cargar datos</span>
                  </Link>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span>Bienvenido, {user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
