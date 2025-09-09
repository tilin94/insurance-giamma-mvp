export interface Sale {
  id: string
  clientName: string
  amount: number
  date: string
  product: string
}

export interface Seller {
  id: string
  name: string
  avatar: string
  totalSales: number
  salesAmount: number
  sales: Sale[]
  efficiency: number // percentage
}

export const sellersData: Seller[] = [
  {
    id: "1",
    name: "Penelope Cruz",
    avatar: "/images/penelope-cruz.jpg",
    totalSales: 47,
    salesAmount: 285600,
    efficiency: 94,
    sales: [
      { id: "s1", clientName: "María González", amount: 8500, date: "2024-09-01", product: "Seguro Vida Premium" },
      { id: "s2", clientName: "Carlos Rodríguez", amount: 12300, date: "2024-09-02", product: "Seguro Auto Completo" },
      { id: "s3", clientName: "Ana Martínez", amount: 6700, date: "2024-09-03", product: "Seguro Hogar" },
      { id: "s4", clientName: "Luis Fernández", amount: 15200, date: "2024-09-04", product: "Seguro Empresarial" },
      { id: "s5", clientName: "Carmen López", amount: 9800, date: "2024-09-05", product: "Seguro Salud" },
    ],
  },
  {
    id: "2",
    name: "Rachel McAdams",
    avatar: "/images/rachel-mcadams.jpg",
    totalSales: 42,
    salesAmount: 267800,
    efficiency: 89,
    sales: [
      { id: "s6", clientName: "Pedro Sánchez", amount: 11200, date: "2024-09-01", product: "Seguro Auto Premium" },
      { id: "s7", clientName: "Isabel García", amount: 7900, date: "2024-09-02", product: "Seguro Vida" },
      { id: "s8", clientName: "Miguel Torres", amount: 13500, date: "2024-09-03", product: "Seguro Empresarial" },
      { id: "s9", clientName: "Laura Jiménez", amount: 8300, date: "2024-09-04", product: "Seguro Hogar Plus" },
      { id: "s10", clientName: "Roberto Díaz", amount: 10600, date: "2024-09-05", product: "Seguro Salud Premium" },
    ],
  },
  {
    id: "3",
    name: "Natalie Portman",
    avatar: "/images/natalie-portman.jpg",
    totalSales: 38,
    salesAmount: 234500,
    efficiency: 85,
    sales: [
      { id: "s11", clientName: "Francisco Morales", amount: 9400, date: "2024-09-01", product: "Seguro Auto" },
      { id: "s12", clientName: "Elena Ruiz", amount: 6800, date: "2024-09-02", product: "Seguro Hogar" },
      { id: "s13", clientName: "Antonio Vega", amount: 12700, date: "2024-09-03", product: "Seguro Vida Premium" },
      { id: "s14", clientName: "Cristina Herrera", amount: 8900, date: "2024-09-04", product: "Seguro Salud" },
      { id: "s15", clientName: "Javier Castillo", amount: 11300, date: "2024-09-05", product: "Seguro Empresarial" },
    ],
  },
  {
    id: "4",
    name: "Nicole Kidman",
    avatar: "/images/nicole-kidman.jpg",
    totalSales: 35,
    salesAmount: 198700,
    efficiency: 78,
    sales: [
      { id: "s16", clientName: "Manuel Ortega", amount: 7600, date: "2024-09-01", product: "Seguro Auto Básico" },
      { id: "s17", clientName: "Pilar Romero", amount: 5900, date: "2024-09-02", product: "Seguro Hogar" },
      { id: "s18", clientName: "Diego Navarro", amount: 9800, date: "2024-09-03", product: "Seguro Vida" },
      { id: "s19", clientName: "Mónica Guerrero", amount: 6500, date: "2024-09-04", product: "Seguro Salud Básico" },
      { id: "s20", clientName: "Raúl Mendoza", amount: 8200, date: "2024-09-05", product: "Seguro Auto" },
    ],
  },
  {
    id: "5",
    name: "Celeste Cid",
    avatar: "/images/celeste-cid.jpg",
    totalSales: 29,
    salesAmount: 156300,
    efficiency: 72,
    sales: [
      { id: "s21", clientName: "Alejandro Silva", amount: 6200, date: "2024-09-01", product: "Seguro Hogar Básico" },
      { id: "s22", clientName: "Beatriz Ramos", amount: 4800, date: "2024-09-02", product: "Seguro Auto" },
      { id: "s23", clientName: "Sergio Peña", amount: 7900, date: "2024-09-03", product: "Seguro Vida" },
      { id: "s24", clientName: "Nuria Campos", amount: 5600, date: "2024-09-04", product: "Seguro Salud" },
      { id: "s25", clientName: "Óscar Delgado", amount: 6800, date: "2024-09-05", product: "Seguro Hogar" },
    ],
  },
]
