import { TicketIcon } from "@heroicons/react/24/solid";

export default function Prices({ prices }) {
  if (prices.length > 0) {
    return (
      <div className="flex gap-x-2">
        <TicketIcon className="size-6 shrink-0" />

        <ul>
          <li className="font-semibold text-lg">Ticket Information</li>
          {/* no id on a price either, and description is optional, so amount and
              description cannot be relied on to tell two apart */}
          {prices.map((price, index) => (
            <li key={index} aria-label="Ticket Price">
              {price.amount} {price.description}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
