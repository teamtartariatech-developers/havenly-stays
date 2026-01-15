type MetaOptions = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
};

const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setLinkTag = (rel: string, href: string) => {
  if (!href) return;
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export const updatePageMeta = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
}: MetaOptions) => {
  if (typeof document === "undefined") return;

  document.title = title;
  setMetaTag("name", "description", description);
  setMetaTag("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");

  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", description);
  setMetaTag("property", "og:type", ogType);

  if (canonical) {
    setLinkTag("canonical", canonical);
    setMetaTag("property", "og:url", canonical);
  }

  if (ogImage) {
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("name", "twitter:image", ogImage);
  }

  setMetaTag("name", "twitter:card", twitterCard);
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", description);
};
