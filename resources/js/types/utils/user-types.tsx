export interface UserData {
  id: number
  name: string
  account_id: string
  email: string
  role: 'admin' | 'instructor' | 'student'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  
  
}

export interface UserProps{
  users: UserData[]
}
