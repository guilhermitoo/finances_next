import Header from '../components/header'

export default function Layout ({children}) {
  return (    
    <main class="h-screen">
      <div class="h-10" >
        <Header />
      </div>
      <div class="h-90">
        {children}
      </div>
    </main>
  
  )
}