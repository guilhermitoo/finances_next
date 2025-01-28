import Header from '../components/header'

export default function Layout ({children}) {
  return (    
    <main class="h-screen bg-gray-100">
      <div class="h-10" >
        <Header />
      </div>
      <div class="text-xs md:text-sm lg:text-base mx-auto px-4 md:w-1/2 h-90">
        {children}
      </div>
    </main>
  
  )
}