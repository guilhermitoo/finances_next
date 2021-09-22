import { signIn } from 'next-auth/client'

export default function AccessDenied () {
  return (
    <div>
      <div class="flex flex-col mx-auto px-4 md:w-1/2 text-center">
        <h1 class="text-bold text-8xl font-mono">Finances</h1>
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
