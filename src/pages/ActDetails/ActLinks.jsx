import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from "@heroicons/react/24/solid";

// Everywhere else this act lives on the internet. The api only renders the
// fields it actually holds, so the order here is the order they appear in, and
// anything missing simply drops out.
const ACT_LINKS = [
  { key: "website", label: "Website" },
  { key: "bandcamp_url", label: "Bandcamp" },
  { key: "facebook_url", label: "Facebook" },
  { key: "instagram_url", label: "Instagram" },
  { key: "linktree_url", label: "Linktree" },
  { key: "musicbrainz_url", label: "MusicBrainz" },
  { key: "rym_url", label: "RateYourMusic" },
  { key: "spotify_url", label: "Spotify" },
  { key: "wikipedia_url", label: "Wikipedia" },
  { key: "youtube_url", label: "YouTube" },
];

export default function ActLinks({ act }) {
  const links = ACT_LINKS.filter(({ key }) => act[key]);

  if (links.length === 0) {
    return null;
  }

  return (
    <section className="px-4 pt-2" aria-label="Act links">
      <h2 className="font-semibold text-lg">Find them online</h2>
      <ul className="flex gap-x-4 gap-y-1 flex-wrap">
        {links.map(({ key, label }) => (
          <li key={key}>
            <a
              href={act[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              {label}
              <ExternalLinkIcon />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
