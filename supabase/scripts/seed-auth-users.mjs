// scripts/seed-auth-users.mjs
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// .env に ↓ を入れておく
// NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
// SUPABASE_SERVICE_ROLE="service_roleのキー（StudioのProject API keysに表示）"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE, // 管理者権限のキー
    { auth: { autoRefreshToken: false, persistSession: false } }
)

const usersToCreate = [
    { email: 'taro@example.com', password: 'password123', user_metadata: { full_name: '太郎' } },
    { email: 'hanako@example.com', password: 'password123', user_metadata: { full_name: '花子' } },
]

const main = async () => {
    const created = []
    for (const u of usersToCreate) {
        const { data, error } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true, // すぐ使える状態に
            user_metadata: u.user_metadata
        })
        if (error) throw error
        created.push({ id: data.user.id, email: u.email, name: u.user_metadata?.full_name ?? '' })
    }
    // 生成した UUID を seed.sql で使いやすいように出力
    for (const c of created) {
        console.log(`-- ${c.email}\n-- id: ${c.id}\n`)
    }
}

main().catch((e) => { console.error(e); process.exit(1) })
