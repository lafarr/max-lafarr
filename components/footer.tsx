export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="artist-name text-2xl mb-2">MAX LAFARR</h2>
          <p className="text-gray-400 text-sm font-light">© {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}

