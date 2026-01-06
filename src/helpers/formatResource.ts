export function formatResource(resource: number): string {
  const resourceInt = Math.floor(resource);

  if (resourceInt >= 1_000_000) {
    return resourceInt / 1_000_000 + "mil";
  }

  if (resourceInt >= 1000) {
    return resourceInt / 1000 + "k";
  }

  return resourceInt.toString()
}
