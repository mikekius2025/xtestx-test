
// This file is a placeholder for Supabase configuration
// After connecting the Supabase integration, this will be populated with proper credentials

// Placeholder to show the structure - the actual client will be created after integration
export const supabaseClient = {
  // Will be replaced with actual Supabase client after integration
  auth: {
    signUp: async () => ({ data: null, error: new Error("Supabase not connected") }),
    signIn: async () => ({ data: null, error: new Error("Supabase not connected") }),
    signOut: async () => ({ error: new Error("Supabase not connected") }),
    resetPasswordForEmail: async () => ({ data: null, error: new Error("Supabase not connected") }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({}),
    insert: () => ({}),
    update: () => ({}),
    delete: () => ({}),
  }),
  rpc: () => ({}),
  storage: { from: () => ({}) },
};
