import React from "react";
import { Link } from "react-router-dom";
import RentalTag from "../components/RentalTag.jsx";

export default function Home() {
  return (
    <div className="bg-canvas">
      {/* HERO */}
      <section className="bg-ink relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center relative">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-sage uppercase mb-6">
              Everything here is borrowed, not bought
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-canvas leading-[1.05] mb-6">
              Furnish your next city,
              <br />
              <span className="text-sage italic">not your last one.</span>
            </h1>
            <p className="text-canvas/70 text-lg max-w-md mb-10 leading-relaxed">
              Skip the cost and hassle of buying furniture you'll just have to move again.
              Rent it tagged, tracked, and ready — return it when you're not.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-rust text-canvas px-7 py-3.5 rounded font-medium hover:brightness-110 transition"
              >
                Browse the catalog
              </Link>
              <Link
                to="/register"
                className="border border-canvas/30 text-canvas px-7 py-3.5 rounded font-medium hover:bg-canvas/10 transition"
              >
                Create account
              </Link>
            </div>

            <div className="flex gap-8 mt-14 font-mono text-canvas/60 text-xs">
              <div>
                <p className="text-canvas text-xl font-semibold mb-1">3–12mo</p>
                tenure options
              </div>
              <div>
                <p className="text-canvas text-xl font-semibold mb-1">48hr</p>
                avg. delivery
              </div>
              <div>
                <p className="text-canvas text-xl font-semibold mb-1">0</p>
                resale hassle
              </div>
            </div>
          </div>

          {/* Signature element: a cluster of hanging rental tags */}
          <div className="relative h-[420px] hidden lg:block">
            <RentalTag subCategory="Sofa" code="SOFA-014" price="1299" tenure="6" rotate={-8} className="absolute top-2 left-10" />
            <RentalTag subCategory="Bed" code="BED-002" price="999" tenure="12" rotate={6} className="absolute top-16 left-56" />
            <RentalTag subCategory="Fridge" code="FRG-031" price="899" tenure="6" rotate={-4} className="absolute top-48 left-2" />
            <RentalTag subCategory="TV" code="TV-009" price="799" tenure="3" rotate={9} className="absolute top-56 left-48" />
            <RentalTag subCategory="Washing Machine" code="WM-018" price="1099" tenure="12" rotate={-10} className="absolute top-[300px] left-24" />
          </div>
        </div>

        {/* torn-edge transition */}
        <svg viewBox="0 0 1200 40" className="block w-full" preserveAspectRatio="none" style={{ height: 28 }}>
          <path d="M0 40 L0 18 L40 28 L80 14 L120 26 L160 10 L200 24 L240 12 L280 28 L320 16 L360 24 L400 10 L440 26 L480 14 L520 28 L560 16 L600 22 L640 10 L680 26 L720 14 L760 28 L800 16 L840 24 L880 10 L920 26 L960 14 L1000 28 L1040 16 L1080 24 L1120 10 L1160 26 L1200 18 L1200 40 Z" fill="#FBF8F2" />
        </svg>
      </section>

      {/* FEATURE STRIP — styled as inventory tags in a row */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="font-mono text-xs tracking-[0.2em] text-ink/40 uppercase mb-3">Why rent instead of buy</p>
        <h2 className="font-display text-3xl text-ink mb-12">Four reasons it just makes sense.</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            ["No big purchase", "Monthly plans mean no five-figure furniture bill before you've even unpacked."],
            ["Flexible terms", "Pick 3, 6, or 12-month tenures and extend or return whenever your plans change."],
            ["Delivered, not dragged", "We schedule delivery and pickup — no van rental, no scraped doorframes."],
            ["Fixed when it breaks", "Request maintenance from your account; we handle repairs, not you."],
          ].map(([title, desc], i) => (
            <div key={title} className="bg-tag rounded-lg p-6 border border-ink/5">
              <p className="font-mono text-[11px] text-rust mb-3">0{i + 1}</p>
              <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-ink rounded-2xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-sage uppercase mb-3">Moving cities for work or college?</p>
            <h2 className="font-display text-3xl md:text-4xl text-canvas max-w-lg">
              Furnish your new place in days. Return it when you're done.
            </h2>
          </div>
          <Link
            to="/products"
            className="bg-rust text-canvas px-8 py-4 rounded font-medium whitespace-nowrap hover:brightness-110 transition"
          >
            Start renting →
          </Link>
        </div>
      </section>
    </div>
  );
}
