import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="content-shell">
      <section className="panel">
        <p className="eyebrow">404</p>
        <h1>That record is not here.</h1>
        <Link className="button button-primary" href="/">
          Return home
        </Link>
      </section>
    </div>
  );
}
