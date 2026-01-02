'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Scan {
  timestamp: string;
  userAgent?: string;
  country?: string;
}

interface QRStats {
  totalScans: number;
  scansToday: number;
  lastScanned: string | null;
  createdAt: string;
  title: string;
  originalUrl: string;
  recentScans: Scan[];
}

export default function DashboardPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [stats, setStats] = useState<QRStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStats();
    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/qr/stats/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setNewUrl(data.data.originalUrl);
      }
    } catch (error) {
      console.error('Erreur fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUrl = async () => {
    if (!newUrl || newUrl === stats?.originalUrl) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/qr/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl }),
      });
      
      if (response.ok) {
        alert('URL mise à jour avec succès!');
        fetchStats();
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">QR code non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard QR Code</h1>
          <p className="text-gray-600">ID: {id}</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm font-medium">TOTAL DES SCANS</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalScans}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm font-medium">SCANS AUJOURD'HUI</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.scansToday}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm font-medium">DERNIER SCAN</h3>
            <p className="text-lg font-semibold text-gray-800 mt-2">
              {stats.lastScanned 
                ? new Date(stats.lastScanned).toLocaleString('fr-FR')
                : 'Jamais'
              }
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mise à jour URL */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Mettre à jour l'URL
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Nouvelle URL de destination
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://nouvelle-url.com"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">
                  URL actuelle
                </label>
                <p className="text-blue-600 break-all bg-gray-50 p-2 rounded">
                  {stats.originalUrl}
                </p>
              </div>
              
              <button
                onClick={updateUrl}
                disabled={updating || !newUrl || newUrl === stats.originalUrl}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                {updating ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </div>

          {/* Derniers scans */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Derniers scans
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Pays</th>
                    <th className="text-left py-2">Appareil</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentScans.map((scan, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2">
                        {new Date(scan.timestamp).toLocaleString('fr-FR')}
                      </td>
                      <td className="py-2">{scan.country || 'Inconnu'}</td>
                      <td className="py-2 text-sm">
                        {scan.userAgent?.substring(0, 50)}...
                      </td>
                    </tr>
                  ))}
                  
                  {stats.recentScans.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-500">
                        Aucun scan pour le moment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Votre QR Code
          </h2>
          <div className="flex flex-col items-center">
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={`/api/qr/image/${id}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-gray-600">
              Ce QR code pointe vers: {process.env.NEXT_PUBLIC_APP_URL}/redirect/{id}
            </p>
            <a
              href={`/api/qr/image/${id}`}
              download={`qr-${id}.png`}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Télécharger le QR Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}