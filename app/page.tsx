'use client';

import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      setQrData(data.data);
      setUrl('');
      setTitle('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Générateur de QR Codes Dynamiques
          </h1>
          <p className="text-gray-600 text-lg">
            Créez, gérez et suivez vos QR codes en temps réel - 100% gratuit
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Créer un nouveau QR Code
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  URL de destination *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemple.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Titre (optionnel)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mon QR Code Marketing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !url}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Génération...
                  </span>
                ) : (
                  'Générer le QR Code'
                )}
              </button>
            </form>
          </div>

          {/* Résultat */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Votre QR Code
            </h2>

            {qrData ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <img
                    src={qrData.qrCodeImage}
                    alt="QR Code"
                    className="w-64 h-64 border-4 border-gray-100 rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Titre</h3>
                    <p className="text-gray-900">{qrData.title}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700">URL de redirection</h3>
                    <p className="text-blue-600 break-all">{qrData.redirectUrl}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <a
                      href={qrData.qrCodeImage}
                      download={`qr-${qrData.shortId}.png`}
                      className="bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded-lg transition"
                    >
                      Télécharger
                    </a>
                    <a
                      href={qrData.dashboardUrl}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg transition"
                    >
                      Voir le dashboard
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📱</div>
                <p className="text-gray-500">
                  Votre QR code apparaîtra ici après génération
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-blue-500 text-2xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Dynamique</h3>
            <p className="text-gray-600">
              Modifiez la destination à tout moment sans changer le QR code
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-green-500 text-2xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">Analytics</h3>
            <p className="text-gray-600">
              Suivez les scans en temps réel avec statistiques détaillées
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-purple-500 text-2xl mb-3">🆓</div>
            <h3 className="font-bold text-lg mb-2">Gratuit</h3>
            <p className="text-gray-600">
              100% gratuit avec Vercel et MongoDB Atlas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}