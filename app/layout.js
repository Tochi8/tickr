import "./globals.css";
import Providers from "../components/Providers";

export const metadata = {
  title: "Tickr — Coinbase Tokenized Stocks on Base",
  description:
    "Tickr lets eligible non-US users buy Coinbase Tokenized Stocks on Base with USDC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
