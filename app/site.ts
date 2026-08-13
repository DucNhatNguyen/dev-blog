const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteUrl = configuredSiteUrl.replace(/\/$/, "");
export const siteMetadata = {
  name: "dev.notes",
  description: "Ghi chép chuyên sâu về lập trình, hệ thống phân tán, cơ sở dữ liệu và kỹ thuật phần mềm.",
  locale: "vi_VN",
};
