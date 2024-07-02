import {
  MusicalNoteIcon,
} from "@heroicons/react/24/solid";

export default function Sets({ sets }) {
  if (sets.length > 0) {
    return(
      <div className="flex gap-x-2">
        <MusicalNoteIcon className="size-6 shrink-0" />

        <ul>
          <li className="font-semibold text-lg">Sets</li>
          {
            sets.map(
              (set) => {
                let description = set.act.name;
                if (set.start_time) {
                  description = `${set.start_time} - ${description}`;
                }
                if (set.duration) {
                  description = `${description} (${set.duration} min)`;
                }
                return(<li key={set.id} aria-label="Artist Set">{description}</li>);
              }
            )
          }
        </ul>
      </div>
    );
  }
}
