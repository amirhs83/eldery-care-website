import { AramsanMark } from "./logo";

export function Footer() {
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date()
  );

  return (
    <footer
      id="footer"
      className="relative bg-teal text-ivory"
    >
      {/* top hairline */}
      <div className="h-px w-full bg-ivory/10" />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-12">
          {/* brand */}
          <div className="sm:col-span-5">
            <div className="flex items-center gap-2">
              <AramsanMark className="h-8 w-8" tone="ivory" />
              <span
                className="text-[1.5rem] font-extrabold tracking-tight text-ivory"
                style={{ fontFamily: "var(--font-vazirmatn)" }}
              >
                آرامسن
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[0.92rem] leading-[1.9] text-ivory/60">
              آرامش، امنیت و مراقبت از عزیزان. آرامسن همراهِ آرام خانواده‌هاست،
              حتی وقتی کنارشان نیستید.
            </p>
          </div>

          {/* links */}
          <div className="sm:col-span-4">
            <h4 className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">
              آرامسن
            </h4>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              {[
                { l: "درباره ما", href: "#" },
                { l: "وبلاگ", href: "#blog" },
                { l: "سوالات متداول", href: "#faq" },
                { l: "تماس با ما", href: "#" },
              ].map((i) => (
                <li key={i.l}>
                  <a
                    href={i.href}
                    className="text-ivory/75 transition-colors hover:text-terracotta-light"
                  >
                    {i.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* social */}
          <div className="sm:col-span-3">
            <h4 className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">
              شبکه‌های اجتماعی
            </h4>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              {["اینستاگرام", "تلگرام", "واتساپ"].map((i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-ivory/75 transition-colors hover:text-terracotta-light"
                  >
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ivory/10 pt-6 text-center sm:flex-row sm:text-right">
          <p className="text-[0.82rem] text-ivory/50">
            © {year} آرامسن. تمامی حقوق محفوظ است.
          </p>
          <p className="text-[0.82rem] text-ivory/50">
            با عشق برای خانواده‌ها طراحی شده است.
          </p>
        </div>
      </div>
    </footer>
  );
}
