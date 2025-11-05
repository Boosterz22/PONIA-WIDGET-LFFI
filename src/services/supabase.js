const mockAuth = {
  session: null,
  
  getSession: async () => {
    const email = localStorage.getItem('ponia_user_email')
    const businessName = localStorage.getItem('ponia_business_name')
    
    if (email) {
      mockAuth.session = { 
        user: { email, business_name: businessName }
      }
      return { data: { session: mockAuth.session } }
    }
    return { data: { session: null } }
  },
  
  signIn: async (email, businessName, businessType) => {
    localStorage.setItem('ponia_user_email', email)
    localStorage.setItem('ponia_business_name', businessName)
    localStorage.setItem('ponia_business_type', businessType)
    mockAuth.session = { 
      user: { email, business_name: businessName, business_type: businessType }
    }
    return { data: { session: mockAuth.session }, error: null }
  },
  
  signOut: async () => {
    localStorage.removeItem('ponia_user_email')
    localStorage.removeItem('ponia_business_name')
    localStorage.removeItem('ponia_business_type')
    mockAuth.session = null
    return { error: null }
  },
  
  onAuthStateChange: (callback) => {
    const subscription = {
      unsubscribe: () => {}
    }
    return { data: { subscription } }
  }
}

export const supabase = {
  auth: mockAuth
}
