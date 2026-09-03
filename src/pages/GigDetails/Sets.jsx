import { MusicalNoteIcon } from "@heroicons/react/24/solid";

export default function Sets({ sets }) {
  if (sets.length > 0) {
    return (
      <div className="flex gap-x-2">
        <MusicalNoteIcon className="size-6 shrink-0" />

        <ul>
          <li className="font-semibold text-lg">Sets</li>
          {sets.map((set, index) => {
            let description = set.act.name;
            if (set.start_time) {
              description = `${set.start_time} - ${description}`;
            }
            if (set.duration) {
              description = `${description} (${set.duration} min)`;
            }
            // the api sends no id for a set, and neither field can stand in for
            // one: start_time is missing on most of them and an act can play
            // twice at one gig. These rows carry no state and the whole list is
            // replaced on every fetch, so position is the honest key.
            return (
              <li key={index} aria-label="Artist Set">
                {description}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
