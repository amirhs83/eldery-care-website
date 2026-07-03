"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "آرامسن چگونه کار می‌کند؟",
    a: "ردیاب کوچک آرامسن همراه عزیزتان قرار می‌گیرد و موقعیت، حرکت و وضعیت او را به‌صورت لحظه‌ای از طریق شبکه موبایل به اپلیکیشن خانواده می‌فرستد. ایستگاه درب هوشمند نیز کنار در نصب می‌شود تا خروج بدون ردیاب را تشخیص دهد.",
  },
  {
    q: "شارژ باتری چند روز دوام می‌آورد؟",
    a: "با یک بار شارژ کامل، ردیاب آرامسن تا ۳ روز کار می‌کند. هنگام کاهش شارژ، هم به عزیزتان و هم به شما یادآوری می‌شود تا جا نماند.",
  },
  {
    q: "آیا به سیم‌کارت نیاز دارد؟",
    a: "بله. ردیاب آرامسن دارای سیم‌کارت داخلی است که ارتباط مستقل با شبکه موبایل را فراهم می‌کند؛ به این ترتیب برای کار کردن، نیازی به گوشی هوشمند یا وای‌فای ندارد.",
  },
  {
    q: "تماس صوتی چگونه برقرار می‌شود؟",
    a: "تماس دوطرفه با یک دکمه روی دستگاه انجام می‌شود. عزیزتان می‌تواند با یک فشار با شما تماس بگیرد و شما نیز می‌توانید از طریق اپلیکیشن با او صحبت کنید، بدون آن‌به نیازی به گوشی هوشمند داشته باشد.",
  },
  {
    q: "آیا برای والدین مبتلا به آلزایمر مناسب است؟",
    a: "آرامسن دقیقاً برای این شرایط طراحی شده است. ایستگاه درب هوشمند خروج بدون ردیاب را تشخیص می‌دهد و با یادآوری صوتی ملایم، فراموشی را به آرامش تبدیل می‌کند. تشخیص سرگردانی و رفتار غیرعادی نیز در کمک به این خانواده‌ها نقش دارد.",
  },
  {
    q: "حریم خصوصی اطلاعات چگونه حفظ می‌شود؟",
    a: "اطلاعات موقعیت و فعالیت فقط برای اعضای خانواده‌ای که شما تعیین می‌کنید قابل مشاهده است. داده‌ها رمزنگاری شده نگه‌داری می‌شوند و بدون اجازه شما با هیچ شخص ثالثی به اشتراک گذاشته نمی‌شوند.",
  },
  {
    q: "قیمت دستگاه و هزینه اشتراک چقدر است؟",
    a: "قیمت دستگاه آرامسن ۹ میلیون و ۵۰۰ هزار تومان است که شامل ردیاب هوشمند، ایستگاه درب اختصاصی و اکسسوری‌های اولیه است. هزینه اشتراک سالانه ۱۰ میلیون تومان است و شامل سیم‌کارت داخلی، پایش ۲۴ ساعته موقعیت، تشخیص سقوط و رفتار غیرعادی، تماس دوطرفه، گزارش‌های هوشمند هوش مصنوعی و پشتیبانی اختصاصی تلفنی و آنلاین است. اعضای اولیه لیست انتظار برای همیشه ۵۰٪ تخفیف روی اشتراک دریافت می‌کنند.",
  },
  {
    q: "آرامسن کی عرضه می‌شود؟",
    a: "عرضه اولیه به اعضای لیست انتظار به‌زودی آغاز می‌شود. با ثبت‌نام، در زودترین زمان و با اولویت نسبت به سایران مطلع خواهید شد.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="mb-10 text-center">
          <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
            سوالات متداول
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-3 text-teal font-extrabold leading-[1.15] tracking-tight"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontFamily: "var(--font-vazirmatn)" }}
          >
            هر سوالی دارید، اینجا پاسخ داریم.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden rounded-[1.5rem] border border-divider bg-warmwhite px-5 sm:px-7"
        >
          <Accordion type="single" collapsible defaultValue="item-0">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-divider"
              >
                <AccordionTrigger className="text-right text-[1rem] font-semibold text-teal hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[0.92rem] leading-[1.95] text-muted-ink">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <p className="mt-6 text-center text-[0.88rem] text-muted-ink">
          هنوز سوالی دارید؟{" "}
          <a href="#footer" className="font-semibold text-terracotta underline-offset-4 hover:underline">
            با ما در تماس باشید
          </a>
        </p>
      </div>
    </section>
  );
}
