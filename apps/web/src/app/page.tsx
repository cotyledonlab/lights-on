import { EarlyAccessForm } from "@/components/early-access-form";
import { EventBeacon } from "@/components/event-beacon";

export default function LandingPage() {
  return (
    <>
      <EventBeacon event="landing_page_view" />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Human-verified purchase records</p>
          <h1>
            Your receipts, <em>made useful.</em>
          </h1>
          <p className="lede">
            Forward the chaos. Get back a clean, checked record you can actually
            use—without trusting a black box to guess.
          </p>
        </div>
        <div aria-label="Example structured receipt" className="receipt-card">
          <div className="receipt-header">
            <span>Record 0042</span>
            <span>Checked ✓</span>
          </div>
          <div className="receipt-row">
            <span>Merchant</span>
            <strong>Harbour Books</strong>
          </div>
          <div className="receipt-row">
            <span>Purchased</span>
            <strong>05 Jul 2026</strong>
          </div>
          <div className="receipt-row">
            <span>Currency</span>
            <strong>EUR</strong>
          </div>
          <div className="receipt-total">
            <span>Total</span>
            <span>€18.40</span>
          </div>
        </div>
      </section>

      <section className="process-section" aria-labelledby="process-title">
        <p className="eyebrow">Deliberately human in the loop</p>
        <h2 className="section-heading" id="process-title">
          Three steps. No mystery.
        </h2>
        <ol className="steps">
          <li>
            <span className="step-number">01 / SEND</span>
            <h3>Share a synthetic record</h3>
            <p>
              Paste a test receipt. Phase 1 never asks for a real document or financial
              account.
            </p>
          </li>
          <li>
            <span className="step-number">02 / CHECK</span>
            <h3>A person verifies it</h3>
            <p>
              A deterministic extractor drafts the fields. An authorized reviewer
              corrects them.
            </p>
          </li>
          <li>
            <span className="step-number">03 / USE</span>
            <h3>Receive clean data</h3>
            <p>
              See the vendor, date, currency, and total as a structured, traceable
              result.
            </p>
          </li>
        </ol>
      </section>

      <section className="signup-panel" id="early-access">
        <p className="eyebrow">Small experiment, honest promise</p>
        <h2>Try the local journey.</h2>
        <p>
          Join early access to test whether human-checked purchase records are useful.
          We collect only an email, your consent, and synthetic input.
        </p>
        <EarlyAccessForm />
      </section>
    </>
  );
}
