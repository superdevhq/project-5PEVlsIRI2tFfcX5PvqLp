
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Define the request body type
interface RequestBody {
  email: string
  password: string
  fullName: string
  trainerId: string
  clientData: {
    age: number
    height: number
    weight: number
    goals: string
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle OPTIONS request for CORS
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get the JWT from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    // Verify the JWT and get the user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid token or user not found')
    }

    // Parse the request body
    const { email, password, fullName, trainerId, clientData } = await req.json() as RequestBody

    // Verify that the authenticated user is the trainer
    if (user.id !== trainerId) {
      throw new Error('Unauthorized: You can only create clients for yourself')
    }

    // 1. Create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: fullName,
        user_type: 'client',
      },
    })

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Failed to create user account')
    }

    // 2. Create the client record
    const { data: newClientData, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        id: authData.user.id,
        name: fullName,
        email: email,
        age: clientData.age,
        height: clientData.height,
        weight: clientData.weight,
        goals: clientData.goals,
        trainer_id: trainerId,
        join_date: new Date().toISOString(),
        profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
      })
      .select()
      .single()

    if (clientError) {
      // If client creation fails, try to clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error(clientError.message || 'Failed to create client record')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Client account created successfully',
        clientId: newClientData.id,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'An error occurred',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})
