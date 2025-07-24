import { Link } from "react-router";
import { filteredGigListPath } from "../../../searchParams";

export default function Genres({ genres }) {
  return (
    <section className="flex gap-2 flex-wrap p-4">
      {(genres || []).map(({ value, id }) => (
        <Link
          to={filteredGigListPath({ genreTagIds: [value] })}
          key={id}
          className="bg-lmlpink text-white text-xs font-medium p-2"
        >
          {value}
        </Link>
      ))}
    </section>
  );
}
