// Renders every date in the bet's fixed offset, not the server's local zone —
// Vercel's functions run in UTC while a laptop doesn't, and "-07:00" as a
// literal offset (not an IANA zone) means Intl needs the Etc/GMT alias, whose
// sign is inverted by POSIX convention (Etc/GMT+7 == UTC-7).
export function offsetToIanaZone(offset: string): string {
  const match = offset.match(/^([+-])(\d{2}):00$/);
  if (!match) return "UTC";
  const [, sign, hoursStr] = match;
  const hours = parseInt(hoursStr, 10);
  const flipped = sign === "-" ? "+" : "-";
  return hours === 0 ? "UTC" : `Etc/GMT${flipped}${hours}`;
}
