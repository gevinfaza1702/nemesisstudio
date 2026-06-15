import "./globals.css";
import dynamic from "next/dynamic";
import PageTransition from "./PageTransition";
import ScrollPerf from "./ScrollPerf";
import GlobalBackgrounds from "./components/GlobalBackgrounds";
import PlanSync from "./PlanSync";
import SessionGuard from "./SessionGuard";
import { Inter, Outfit } from "next/font/google";
import { SettingsProvider } from "./context/SettingsContext";

// Lazy load heavy modal component
const LegacyCropperModal = dynamic(
  () => import("./components/LegacyCropperModal"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata = {
  title: "Nemesis Studio - AI Video & Image Generator",
  description: "Generate amazing videos and images with Nemesis Studio",
  icons: {
    icon: "/images/nemesisstudio.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="icon" href="/images/nemesisstudio.png" type="image/png" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </noscript>
        <style>{`html,body{background:#000;color:#f5f7fb}`}</style>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SettingsProvider>
          <GlobalBackgrounds />
          <ScrollPerf />
          <PlanSync />
          <SessionGuard />
          <PageTransition>
            {children}
          </PageTransition>

          <LegacyCropperModal />
        </SettingsProvider>
      </body>
    </html>
  );
}
