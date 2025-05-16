import { signIn } from 'next-auth/client'

export default function AccessDenied () {
  return (
    <div class="flex">
      <div class="flex flex-col w-full text-center">
        <h1 class="text-bold text-7xl font-mono pt-10">Finances</h1>
        <p>
          Controle suas finanças de forma simples e eficiente, sem complicações.
        </p>
        <p>
          {/* <a href="/api/auth/signin"
            onClick={(e) => {
            e.preventDefault()
            signIn()
          }}>teste</a> */}
        </p>
      </div>
    </div>
  )
}
