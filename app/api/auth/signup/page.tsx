import { redirect } from "next/navigation"

export default function SignupPage() {
  redirect("/auth/login?tab=signup")
  return null
}

