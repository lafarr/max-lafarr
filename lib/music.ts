export function getReleaseDateTimestamp(releaseDate: string): number {
  const slashParts = releaseDate.split('/');
  if (slashParts.length === 2) {
    const [month, year] = slashParts;
    return new Date(parseInt(year), parseInt(month) - 1).getTime();
  }

  const dashParts = releaseDate.split('-');
  if (dashParts.length === 2) {
    const [year, month] = dashParts;
    return new Date(parseInt(year), parseInt(month) - 1).getTime();
  }

  return new Date(releaseDate).getTime();
}

export function sortAlbumsByReleaseDateDesc<T extends { release_date: string }>(albums: T[]): T[] {
  return [...albums].sort((a, b) => getReleaseDateTimestamp(b.release_date) - getReleaseDateTimestamp(a.release_date));
}
