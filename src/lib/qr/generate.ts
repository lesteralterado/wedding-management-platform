import QRCode from "qrcode";

export async function generateQrSvg(url: string) {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    width: 260,
    color: {
      dark: "#d35400",
      light: "#fffaf1",
    },
  });
}

export async function generateQrDataUrl(url: string) {
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 320,
    color: {
      dark: "#d35400",
      light: "#fffaf1",
    },
  });
}
