import { themeStyles } from "@repo/ui/theme-styles";
import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard · App Factory",
  description:
    "Entrada local a las aplicaciones, herramientas y stack de App Factory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" {...stylex.props(themeStyles.root)}>
      <body>{children}</body>
    </html>
  );
}
