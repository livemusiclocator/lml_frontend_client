const ACT_LINKS = [
  { key: "website", label: "Website" },
  { key: "bandcamp_url", label: "Bandcamp" },
  { key: "spotify_url", label: "Spotify" },
  { key: "facebook_url", label: "Facebook" },
  { key: "instagram_url", label: "Instagram" },
  { key: "youtube_url", label: "YouTube" },
  { key: "linktree_url", label: "Linktree" },
  { key: "musicbrainz_url", label: "MusicBrainz" },
  { key: "rym_url", label: "RateYourMusic" },
  { key: "wikipedia_url", label: "Wikipedia" },
];

export default function ActLinks({ act }) {
  const links = ACT_LINKS.filter(({ key }) => act[key]);

  if (links.length === 0) {
    return null;
  }

  return (
    <section className="flex gap-2 flex-wrap px-4 pt-4">
      {links.map(({ key, label }) => (
        <a
          key={key}
          href={act[key]}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-lmlpink text-white text-xs font-medium p-2"
        >
          {label}
        </a>
      ))}
    </section>
  );
}
