import { supabase } from '../lib/supabaseClient'

export async function signUpUser({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    alert(error.message)
    return null
  }

  const user = data.user

  if (user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          name,
          role: 'user'
        }
      ])

    if (profileError) {
      console.error(profileError)
    }
  }

  return data
}