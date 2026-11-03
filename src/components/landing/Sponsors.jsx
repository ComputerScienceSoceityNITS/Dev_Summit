export default function Sponsors() {
  return (
    <section className="sponsors" aria-labelledby="sponsors-title">
      <p id="sponsors-title" className="sponsors__label">
        Sponsored by
      </p>
      <a
        href="https://aws.amazon.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="sponsors__card"
      >
        <img src="/assets/AWS_Logo.png" alt="Amazon Web Services" />
      </a>
    </section>
  );
}
