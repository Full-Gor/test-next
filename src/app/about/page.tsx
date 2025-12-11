export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">À propos de E-Shop</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Votre destination shopping en ligne de confiance depuis 2024
        </p>
      </div>

      {/* Story */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notre histoire</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          E-Shop est né d&apos;une passion pour le commerce en ligne et d&apos;une volonté de proposer
          une expérience d&apos;achat simple, sécurisée et agréable. Notre équipe travaille chaque jour
          pour vous offrir les meilleurs produits au meilleur prix.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Nous croyons que le shopping en ligne devrait être accessible à tous, c&apos;est pourquoi
          nous mettons tout en œuvre pour garantir une navigation intuitive et un service client
          réactif.
        </p>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Qualité</h3>
            <p className="text-gray-600">
              Nous sélectionnons rigoureusement chaque produit pour vous garantir la meilleure qualité.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Service client</h3>
            <p className="text-gray-600">
              Une équipe dédiée à votre satisfaction, disponible pour répondre à toutes vos questions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sécurité</h3>
            <p className="text-gray-600">
              Vos données et vos paiements sont protégés par les dernières technologies de sécurité.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-semibold mb-8 text-center">E-Shop en chiffres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold mb-2">30+</p>
            <p className="text-indigo-100">Produits</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">5</p>
            <p className="text-indigo-100">Catégories</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">100%</p>
            <p className="text-indigo-100">Satisfaction</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">24/7</p>
            <p className="text-indigo-100">Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
