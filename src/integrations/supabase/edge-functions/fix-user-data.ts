
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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

    // Check if the user is in both tables
    const { data: clientData } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    const { data: trainerData } = await supabaseAdmin
      .from('trainers')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    let userType = null
    let fixedData = {}

    // If user is in both tables, determine the correct one and remove from the other
    if (clientData && trainerData) {
      // Determine which one to keep based on user preference or most recent activity
      // For this example, we'll prioritize client role
      userType = 'client'
      
      // Remove from trainers table
      const { error: deleteError } = await supabaseAdmin
        .from('trainers')
        .delete()
        .eq('id', user.id)

      if (deleteError) {
        throw new Error(`Failed to remove duplicate entry: ${deleteError.message}`)
      }

      fixedData = {
        removed: 'trainer',
        kept: 'client'
      }
    } else if (clientData) {
      userType = 'client'
      fixedData = { userType }
    } else if (trainerData) {
      userType = 'trainer'
      fixedData = { userType }
    } else {
      throw new Error('User not found in either clients or trainers table')
    }

    // Update user metadata with the correct user type
    if (userType) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            user_type: userType
          }
        }
      )

      if (updateError) {
        throw new Error(`Failed to update user metadata: ${updateError.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User data fixed successfully',
        userType,
        fixedData
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
