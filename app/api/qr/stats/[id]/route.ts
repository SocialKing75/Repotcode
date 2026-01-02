import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(context.params);
    
    const collection = await getCollection('qrcodes');
    const qrCode = await collection.findOne(
      { shortId: id },
      {
        projection: {
          scans: 1,
          lastScanned: 1,
          createdAt: 1,
          title: 1,
          originalUrl: 1,
          scanHistory: { $slice: -50 }, // Derniers 50 scans
        },
      }
    );

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code non trouvé' },
        { status: 404 }
      );
    }

    // Calculer les statistiques
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scansToday = qrCode.scanHistory?.filter(
      (scan: any) => new Date(scan.timestamp) >= today
    ).length || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalScans: qrCode.scans,
        scansToday,
        lastScanned: qrCode.lastScanned,
        createdAt: qrCode.createdAt,
        title: qrCode.title,
        originalUrl: qrCode.originalUrl,
        recentScans: qrCode.scanHistory || [],
      },
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}