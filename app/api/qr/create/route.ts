import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { generateShortId, generateQRCodeDataURL } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, title, description } = body;

    // Validation
    if (!url) {
      return NextResponse.json(
        { error: 'L\'URL est requise' },
        { status: 400 }
      );
    }

    // Vérifier que c'est une URL valide
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'URL invalide' },
        { status: 400 }
      );
    }

    const collection = await getCollection('qrcodes');
    const shortId = generateShortId();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/redirect/${shortId}`;

    // Générer le QR code
    const qrCodeImage = await generateQRCodeDataURL(redirectUrl);

    // Document à insérer
    const qrDocument = {
      shortId,
      originalUrl: url,
      redirectUrl,
      title: title || `QR pour ${new URL(url).hostname}`,
      description: description || '',
      qrCodeImage,
      scans: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      scanHistory: [] as Array<{
        timestamp: Date;
        userAgent?: string;
        ip?: string;
        country?: string;
      }>,
    };

    // Insérer dans MongoDB
    const result = await collection.insertOne(qrDocument);

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId,
        shortId,
        qrCodeImage,
        redirectUrl,
        originalUrl: url,
        title: qrDocument.title,
        dashboardUrl: `${baseUrl}/dashboard/${shortId}`,
        createdAt: qrDocument.createdAt,
      },
    });
  } catch (error) {
    console.error('Erreur création QR:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}