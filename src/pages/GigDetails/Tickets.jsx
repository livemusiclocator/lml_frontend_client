export default function Tickets({ url }) {
  if (url) {
    return (
      <section className="p-4">
        <a
          href={url}
          className="flex content-center transition items-center justify-center text-center px-8 py-4 text-xl font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 mx-auto px-8"
        >
          <div className="flex items-center justify-start space-x-1.5">
            <span>Gig Details</span>
          </div>
        </a>
      </section>
    );
  }
}
