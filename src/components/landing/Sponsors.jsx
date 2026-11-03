export default function Sponsors() {
  return (
    <section className="spons" aria-labelledby="spons-title">
      <div className="spons__inner">
        <div className="spons__label">
          <p id="spons-title" className="spons__eyebrow">
            <span>/</span> SPONSORED BY
          </p>
          <p className="spons__note">
            Dev Summit 2026 is proudly supported by AWS.
          </p>
        </div>

        <a
          className="spons__card"
          href="https://aws.amazon.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Amazon Web Services"
        >
          <img
            src="https://cdn.freebiesupply.com/logos/large/2x/aws-logo-logo-png-transparent.png"
            alt="Amazon Web Services"
          />
        </a>
      </div>
    </section>
  );
}
