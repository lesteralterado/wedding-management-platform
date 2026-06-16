export function createSlug(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "wedding";
}

export function uniqueSlug(base: string, used: string[]) {
  if (!used.includes(base)) return base;

  let index = 2;
  while (used.includes(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}
