import logoImg from '/src/assets/images/Logo.svg'
import searchImg from '/src/assets/images/search.svg'

function Header() {
  return (
    <header className="bg-white shadow-md z-40">
      <div className="flex flex-col items-center px-4 py-3 gap-3">
        <img src={logoImg} alt="SafeMap" className="h-10 w-auto" />
        
        <div className="w-full max-w-md">
          <div className="relative">
            <img src={searchImg} alt="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search safe zones or locations..." 
              className="w-full h-10 pl-10 pr-4 bg-gray-100 rounded-full outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
