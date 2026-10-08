import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export function verifyUrl(id: string, origin?: string) {
  return `${origin ?? "https://domain.com"}/verify/${id}`;
}

export function QRCode({ id, size = 148, showUrl = true }: { id: string; size?: number; showUrl?: boolean }) {
  const [origin, setOrigin] = useState<string | undefined>();
  useEffect(() => setOrigin(window.location.origin), []);
  const url = verifyUrl(id, origin);
  return (
    <figure className="flex flex-col items-center gap-2">
      <div className="rounded-xl bg-popover p-3 ring-1 ring-border">
        <QRCodeSVG value={url} size={size} fgColor="#101d2e" bgColor="transparent" level="M" aria-label={`QR Code verifikasi ${id}`} role="img" />
      </div>
      {showUrl && <figcaption className="max-w-[220px] break-all text-center font-mono text-[11px] text-muted-foreground">{url}</figcaption>}
    </figure>
  );
}
