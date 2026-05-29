import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json([]);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1&featuretype=city`,
      { headers: { "User-Agent": "Jobnique/1.0" }, next: { revalidate: 86400 } }
    );
    const data = await res.json();
    // Extract clean city, state/country labels
    const suggestions = data
      .map((item: { address?: { city?: string; town?: string; village?: string; state?: string; country?: string; country_code?: string } }) => {
        const a = item.address || {};
        const city = a.city || a.town || a.village || "";
        const region = a.state || a.country || "";
        const label = [city, region].filter(Boolean).join(", ");
        return label;
      })
      .filter((l: string) => l.length > 0)
      .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i); // dedupe
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
