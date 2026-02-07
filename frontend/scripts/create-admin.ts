import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
        "Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in frontend/.env.local",
    );
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function createAdmin(email: string, pass: string) {
    console.log(`Creating admin user: ${email}...`);

    // 1. Create user in Auth
    const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
            email,
            password: pass,
            email_confirm: true,
        });

    if (authError) {
        console.error("Error creating user:", authError.message);
        return;
    }

    const userId = authData.user.id;
    console.log(`User created with ID: ${userId}`);

    // 2. Assign admin role
    const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: "admin",
    });

    if (roleError) {
        console.error("Error assigning admin role:", roleError.message);
        return;
    }

    console.log("Admin role assigned successfully!");
    console.log(`\nSuccess! You can now log in at /admin/login with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${pass}`);
}

const [email, password] = process.argv.slice(2);

if (!email || !password) {
    console.log("Usage: npx tsx scripts/create-admin.ts <email> <password>");
    process.exit(1);
}

createAdmin(email, password).catch(console.error);
