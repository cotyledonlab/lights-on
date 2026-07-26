import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import "./styles.css";

export const metadata: Metadata = {
  description:
    "A human-verified experiment for turning purchase records into useful structured data.",
  title: {
    default: "Receipt Light",
    template: "%s · Receipt Light"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="brand" href="/">
            <span aria-hidden="true" className="brand-mark">
              R/
            </span>
            Receipt Light
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/privacy">Privacy</Link>
            <Link href="/review">Reviewer</Link>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <p>A local-only product experiment. Use synthetic purchase data.</p>
          <p>Built for evidence, not assumption.</p>
        </footer>
      </body>
    </html>
  );
}
