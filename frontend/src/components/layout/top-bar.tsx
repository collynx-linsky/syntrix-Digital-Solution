import { MapPin, Phone, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TopBar() {
  const t = await getTranslations("contact.info");

  return (
    <div className="hidden bg-brand-950 text-ink-300 lg:block">
      <div className="container-page flex h-9 items-center justify-between text-xs">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold-400" />
            {t("office")}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-gold-400" />
            <a href={`tel:${t("phone")}`} className="hover:text-white">{t("phone")}</a>
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-gold-400" />
            <a href={`mailto:${t("email")}`} className="hover:text-white">{t("email")}</a>
          </span>
        </div>
        <span className="text-ink-400">{t("hours")}</span>
      </div>
    </div>
  );
}
