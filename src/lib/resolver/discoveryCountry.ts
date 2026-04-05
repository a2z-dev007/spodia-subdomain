/**
 * Discovery tenants use dotted hostnames whose last label is a country id, e.g.
 * `mumbai.maharashtra.in.spodia.com` → `/site/in/maharashtra/mumbai`.
 *
 * Matching rules:
 * 1. ISO 3166-1 alpha-2 codes (lowercase): `in`, `us`, `gb`, …
 * 2. Optional extra slugs from env `SPODIA_DISCOVERY_COUNTRY_SLUGS` (comma-separated),
 *    e.g. `india,united-states,uk` for long-form or non-ISO aliases.
 */

const ISO_3166_1_ALPHA2 = new Set(
  `ad ae af ag ai al am ao aq ar as at au aw ax az ba bb bd be bf bg bh bi bj bl bm bn bo bq br bs bt bv bw by bz ca cc cd cf cg ch ci ck cl cm cn co cr cu cv cw cx cy cz de dj dk dm do dz ec ee eg eh er es et fi fj fk fm fo fr ga gb gd ge gf gg gh gi gl gm gn gp gq gr gs gt gu gw gy hk hm hn hr ht hu id ie il im in io iq ir is it je jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md me mf mg mh mk ml mm mn mo mp mq mr ms mt mu mv mw mx my mz na nc ne nf ng ni nl no np nr nu nz om pa pe pf pg ph pk pl pm pn pr ps pt pw py qa re ro rs ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr ss st sv sx sy sz tc td tf tg th tj tk tl tm tn to tr tt tv tw tz ua ug um us uy uz va vc ve vg vi vn vu wf ws ye yt za zm zw`
    .split(/\s+/),
);

function loadEnvExtraSlugs(): Set<string> {
  const raw = process.env.SPODIA_DISCOVERY_COUNTRY_SLUGS ?? "";
  const set = new Set<string>();
  for (const part of raw.split(",")) {
    const s = part.trim().toLowerCase();
    if (s) set.add(s);
  }
  return set;
}

const ENV_EXTRA_SLUGS = loadEnvExtraSlugs();

export function isDiscoveryCountrySegment(segment: string): boolean {
  const s = segment.trim().toLowerCase();
  if (!s) return false;
  if (ISO_3166_1_ALPHA2.has(s)) return true;
  if (ENV_EXTRA_SLUGS.has(s)) return true;
  return false;
}
