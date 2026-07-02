import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "آرامسن | آرامش خاطر برای خانواده‌ها",
  description:
    "ردیاب هوشمند و ایستگاه درب اختصاصی آرامسن برای مراقبت از سالمندان، کودکان و عزیزان شما. جزو اولین خانواده‌های آرامسن باشید و ۵۰٪ تخفیف مادام‌العمر دریافت کنید.",
  keywords: [
    "آرامسن",
    "ردیاب هوشمند",
    "مراقبت از سالمندان",
    "ایستگاه درب هوشمند",
    "آرامش خاطر خانواده",
    "تشخیص سقوط",
    "ردیابی GPS",
    "لیست انتظار",
  ],
  authors: [{ name: "آرامسن" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "آرامسن | آرامش خاطر برای خانواده‌ها",
    description:
      "ردیاب هوشمند و ایستگاه درب اختصاصی برای مراقبت از عزیزان شما. همین الان جزو اولین خانواده‌ها باشید.",
    siteName: "آرامسن",
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "آرامسن | آرامش خاطر برای خانواده‌ها",
    description: "ردیاب هوشمند و ایستگاه درب اختصاصی برای مراقبت از عزیزان شما.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
