import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL =
  process.env.LEETCODE_UPSTREAM_API_BASE_URL ||
  "https://alfa-leetcode-api.onrender.com";

// ============================================================
// Server-Side Memory Cache
// ============================================================

interface CacheEntry {
  data: any;
  status: number;
  headers: Record<string, string>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL on server

function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!path || path.length === 0) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  // Clean cache periodically
  cleanExpiredCache();

  const subPath = path.join("/");
  const searchParams = request.nextUrl.search;
  const targetUrl = `${API_BASE_URL}/${subPath}${searchParams}`;
  
  // Check server cache
  const cached = cache.get(targetUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      status: cached.status,
      headers: {
        "x-cache": "HIT",
        "cache-control": "public, max-age=600",
      },
    });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${subPath}`, {
      params: Object.fromEntries(request.nextUrl.searchParams),
      timeout: 10000,
    });

    // Cache successful responses
    cache.set(targetUrl, {
      data: response.data,
      status: response.status,
      headers: {},
      timestamp: Date.now(),
    });

    return NextResponse.json(response.data, {
      status: response.status,
      headers: {
        "x-cache": "MISS",
        "cache-control": "public, max-age=600",
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // If we got a 429 from upstream but have old cached data, return it!
      if (error.response.status === 429 && cached) {
        return NextResponse.json(cached.data, {
          status: 200,
          headers: {
            "x-cache": "STALE-HIT",
            "cache-control": "public, max-age=60",
          },
        });
      }

      return NextResponse.json(
        { error: error.response.data || error.message },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: error.message || "Upstream request failed" },
      { status: 502 }
    );
  }
}
