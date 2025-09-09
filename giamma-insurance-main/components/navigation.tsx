"use client"

import { useAuth } from "@/contexts/auth-context"
import { usePack } from "@/contexts/pack-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, Phone, Upload, Users, Shield, BarChart3, Activity } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PackSelector } from "./pack-selector"

export function Navigation() {
  const { user, logout } = useAuth()
  const { hasFeature, selectedPack } = usePack()
  const pathname = usePathname()

  const hasRoles = selectedPack !== "pack1"

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <PackSelector />

            {user && (
              <div className="flex items-center space-x-4">
                {hasFeature("contactacion") && (
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
                )}

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
                  <div className="relative group">
                    <Link
                      href="/reportes"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        hasRoles
                          ? `border-2 border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 ${
                              pathname === "/reportes"
                                ? "bg-orange-500 text-white border-orange-500"
                                : "text-orange-400 hover:text-orange-300"
                            }`
                          : pathname === "/reportes"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {hasRoles && <Shield className="h-4 w-4" />}
                      <BarChart3 className="h-4 w-4" />
                      <span>Reportes</span>
                    </Link>
                    {hasRoles && (
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Solo visible para administradores
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                )}

                {hasFeature("auditoria") && (
                  <div className="relative group">
                    <Link
                      href="/auditoria"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        hasRoles
                          ? `border-2 border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 ${
                              pathname === "/auditoria"
                                ? "bg-orange-500 text-white border-orange-500"
                                : "text-orange-400 hover:text-orange-300"
                            }`
                          : pathname === "/auditoria"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {hasRoles && <Shield className="h-4 w-4" />}
                      <Activity className="h-4 w-4" />
                      <span>Auditoría</span>
                    </Link>
                    {hasRoles && (
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Solo visible para administradores
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                )}

                {hasFeature("cargar-datos") && (
                  <div className="relative group">
                    <Link
                      href="/cargar-datos"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        hasRoles
                          ? `border-2 border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 ${
                              pathname === "/cargar-datos" || pathname === "/"
                                ? "bg-orange-500 text-white border-orange-500"
                                : "text-orange-400 hover:text-orange-300"
                            }`
                          : (pathname === "/cargar-datos" || pathname === "/")
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {hasRoles && <Shield className="h-4 w-4" />}
                      <Upload className="h-4 w-4" />
                      <span>Cargar datos</span>
                    </Link>
                    {hasRoles && (
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Solo visible para administradores
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
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
