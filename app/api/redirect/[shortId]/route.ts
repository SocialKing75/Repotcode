import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  context: { params: { shortId: string } }
) {
  try {
    const { shortId } = await Promise.resolve(context.params);
    
    const collection = await getCollection('qrcodes');
    const qrCode = await collection.findOne({ shortId, isActive: true });

    if (!qrCode) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/404`,
        302
      );
    }

    // Mettre à jour les statistiques
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    await collection.updateOne(
      { shortId },
      {
        $inc: { scans: 1 },
        $set: { lastScanned: new Date() },
        $push: {
          scanHistory: {
            timestamp: new Date(),
            userAgent,
            ip,
            country: request.headers.get('cf-ipcountry') || 'unknown',
          },
        },
      }
    );

    // Rediriger vers l'URL originale
    return NextResponse.redirect(qrCode.originalUrl, 302);
  } catch (error) {
    console.error('Erreur redirection:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/500`,
      302
    );
  }
}