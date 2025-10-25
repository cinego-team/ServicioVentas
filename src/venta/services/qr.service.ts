import * as QRCode from 'qrcode';

export async function generarQR(algo: string): Promise<string> {
    return await QRCode.toDataURL(algo);
}