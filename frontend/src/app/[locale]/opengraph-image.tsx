import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #05070b 0%, #0b2670 55%, #071646 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #4a86ff, #0a2c8c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{t("brand")}</div>
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, marginTop: 48, maxWidth: 900, lineHeight: 1.15 }}>
          {t("tagline")}
        </div>
        <div style={{ fontSize: 26, marginTop: 24, color: "#9aa2b3" }}>{t("meta.companyLocation")}</div>
      </div>
    ),
    { ...size }
  );
}
