import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Data deleted" };

export default function DeletedPage() {
  return (
    <div className="content-shell">
      <section className="panel">
        <p className="eyebrow">Deletion complete</p>
        <h1>Your local experiment data is gone.</h1>
        <p className="panel-intro">
          The participant record and its related data were deleted. You can return to
          the landing page without an active participant session.
        </p>
        <Link className="button button-primary" href="/">
          Return home
        </Link>
      </section>
    </div>
  );
}
