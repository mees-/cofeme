"use client";

import { QRCodeSVG } from "qrcode.react";

type QRCodeProps = {
  value: string;
  size?: number;
};

export function QRCode({ value, size = 256 }: QRCodeProps) {
  return (
    <div className="bg-white p-4 rounded-lg inline-block">
      <QRCodeSVG value={value} size={size} />
    </div>
  );
}

