export type UserRole = 'admin' | 'organizer' | 'user'
export type EventStatus = 'activo' | 'cancelado' | 'finalizado'
export type NotificationType = 'recordatorio' | 'inscripcion' | 'cancelacion' | 'sistema'

export interface User {
  _id: string
  nombre: string
  apellido: string
  email: string
  fotoPerfil?: string | null
  rol: UserRole
  createdAt?: string
}

export interface Category {
  _id: string
  nombre: string
  descripcion?: string
  color?: string
  activa: boolean
  createdAt?: string
}

export interface Event {
  _id: string
  titulo: string
  descripcion: string
  categoria: Category | string
  fecha: string
  hora: string
  ubicacion: string
  capacidadMaxima: number
  imagen?: string | null
  organizador: User | string
  estado: EventStatus
  participantes?: number
  espaciosDisponibles?: number
  createdAt?: string
}

export interface NotificationItem {
  _id: string
  usuario: string
  evento?: Pick<Event, '_id' | 'titulo' | 'fecha' | 'hora' | 'ubicacion'> | null
  tipo: NotificationType
  titulo: string
  mensaje: string
  leida: boolean
  createdAt?: string
}

export interface Registration {
  _id: string
  usuario: string
  evento: Event
  estado: 'activa' | 'cancelada'
  fechaInscripcion?: string
}

export interface Favorite {
  _id: string
  usuario: string
  evento: Event
  createdAt?: string
}

export interface DashboardSummaryUser {
  rol: 'user'
  resumen: {
    totalInscripciones: number
    totalFavoritos: number
    notificacionesNoLeidas: number
  }
  proximasActividades: Registration[]
  historial: Registration[]
}

export interface DashboardSummaryOrganizer {
  rol: 'organizer'
  resumen: {
    totalActividades: number
    actividadesActivas: number
    actividadesCanceladas: number
    actividadesFinalizadas: number
    totalParticipantes: number
  }
  proximasActividades: Event[]
  misActividades: Event[]
}

export interface DashboardSummaryAdmin {
  rol: 'admin'
  resumen: {
    usuarios: {
      total: number
      organizadores: number
      usuariosComunes: number
    }
    actividades: {
      total: number
      activas: number
      canceladas: number
      finalizadas: number
    }
    inscripcionesTotales: number
    totalCategorias: number
  }
}

export type DashboardData = DashboardSummaryUser | DashboardSummaryOrganizer | DashboardSummaryAdmin

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}
