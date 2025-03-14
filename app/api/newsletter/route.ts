import { NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
    const supabaseUrl = process.env.SUBABASE_URL ?? '';
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey ?? '')

    let email: string = (await req.json()).email;
    email = email.trim();

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: process.env.SUPABASE_EMAIL ?? '',
            password: process.env.SUPABASE_PASSWORD ?? ''
        });

        if (error) {
            console.error('Error signing in:', error.message)
        }

        const { error: err } = await supabase
            .from('subscribers')
            .insert([{ email }]);

        if (err || !data) {
            console.log(err);
            return new Response(JSON.stringify({ error: err?.message || "some error" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ message: 'Successfully subscribed!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}