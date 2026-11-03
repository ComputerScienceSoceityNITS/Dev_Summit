const BUILDER_LINK = "https://bit.ly/4vtn79b";
const FORM_LINK = "https://forms.gle/qFm7So1iU5mSnE6DA";

const steps = [
  {
    n: "01",
    text: "Create your AWS Builder Center profile through the official registration link. It must be a new registration, done only through this link.",
    href: BUILDER_LINK,
  },
  {
    n: "02",
    text: "Fill out the AWS Builder Center Details Form so your details reach AWS.",
    href: FORM_LINK,
  },
];

export default function AwsGoodies() {
  return (
    <section className="aws" id="goodies" aria-labelledby="aws-title">
      <div className="aws__inner">
        <div className="aws__left">
          <p className="aws__eyebrow">
            <span>06</span> / SPONSOR PERK
          </p>
          <h2 id="aws-title" className="aws__title">
            CLAIM
            <br />
            YOUR
            <br />
            <em>GOODIES.</em>
          </h2>
          <p className="aws__lead">
            Dev Summit is sponsored by AWS. To receive goodies, every
            participant must complete both steps.
          </p>
          <a
            className="aws__btn"
            href={BUILDER_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            Register on AWS Builder Center ↗
          </a>
        </div>

        <ol className="aws__steps">
          {steps.map((s) => (
            <li key={s.n}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                <span className="aws__num">{s.n}</span>
                <span className="aws__text">{s.text}</span>
                <span className="aws__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
