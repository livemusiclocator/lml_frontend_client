export default function Genres({ genres }) {
  return(
    <section className="flex gap-2 flex-wrap p-4">
      {(genres || []).map(({ value, id }) => (
        <span
          key={id}
          className="bg-lmlpink text-white text-xs font-medium p-2"
        >
          {value}
        </span>
      ))}
    </section>
  );
}
