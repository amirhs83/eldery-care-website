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
  title: "سن یار | آرامش خاطر برای خانواده‌ها",
  description:
    "ردیاب هوشمند با هوش مصنوعی و ایستگاه درب اختصاصی سن یار برای مراقبت از سالمندان، کودکان و عزیزان شما. مجهز به هوش مصنوعی با تحلیل اختصاصی رفتار و فعالیت. جزو اولین خانواده‌های سن یار باشید و ۵۰٪ تخفیف مادام‌العمر دریافت کنید.",
  keywords: [
    "سن یار",
    "ردیاب هوشمند",
    "ردیاب هوشمند با هوش مصنوعی",
    "مراقبت از سالمندان",
    "ایستگاه درب هوشمند",
    "آرامش خاطر خانواده",
    "هوش مصنوعی",
    "تحلیل اختصاصی رفتار",
    "تشخیص سقوط",
    "ردیابی GPS",
    "لیست انتظار",
  ],
  authors: [{ name: "سن یار" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "سن یار | آرامش خاطر برای خانواده‌ها",
    description:
      "ردیاب هوشمند و ایستگاه درب اختصاصی برای مراقبت از عزیزان شما. همین الان جزو اولین خانواده‌ها باشید.",
    siteName: "سن یار",
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "سن یار | آرامش خاطر برای خانواده‌ها",
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
