import QRCode from 'qrcode';
import { customAlphabet } from 'nanoid';

// Générer un ID court pour les QR codes
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const generateShortId = customAlphabet(alphabet, 8);

// Générer un QR code en base64
export async function generateQRCodeDataURL(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000FF',
        light: '#FFFFFFFF',
      },
    });
  } catch (error) {
    throw new Error('Erreur lors de la génération du QR code');
  }
}

// Formater la date
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}