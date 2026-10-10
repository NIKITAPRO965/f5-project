
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

export async function searchCommonsImages(query, offset = 0) {
  const url = new URL(COMMONS_API);

  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", `filetype:bitmap ${query}`);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "12");
  url.searchParams.set("gsroffset", String(offset));
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url");
  url.searchParams.set("iiurlwidth", "900");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Не удалось загрузить изображения");
  }

  const data = await response.json();

  const pages = Object.values(data.query?.pages || {});

  const images = pages
    .filter((page) => page.imageinfo?.[0])
    .map((page) => ({
      id: page.pageid,
      title: page.title.replace(/^File:/, "").replace(/_/g, " "),
      url:
        page.imageinfo[0].thumburl ||
        page.imageinfo[0].url,
      sourceUrl: `https://commons.wikimedia.org/?curid=${page.pageid}`,
    }));

  return {
    images,
    nextOffset: data.continue?.gsroffset ?? null,
  };
}
