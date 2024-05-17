import {
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

export default function InfoTags({ infoTags }) {
  if (infoTags.length > 0) {
    return(
      <div className="flex gap-x-2">
        <InformationCircleIcon className="size-6 shrink-0" />

        <ul>
          <li className="font-semibold text-lg">Event Information</li>
          {infoTags.map(({ id, value }) => (
            <li key={id} aria-label="Event information">
              {value}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
