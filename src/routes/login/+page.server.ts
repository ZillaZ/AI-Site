import type { Actions } from './$types';

export const actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData()
        const enc = new TextEncoder()
        const dec = new TextDecoder()
        const email = data.get("email")
        let password = data.get("password")?.toString()
        password = dec.decode(await crypto.subtle.digest("SHA-256", enc.encode(password)))
        const response = await fetch("http://127.0.0.1:8080/login", {
            method: "POST",
            body: email + "\n" + password
        })
        console.log(response)
    }
} satisfies Actions;