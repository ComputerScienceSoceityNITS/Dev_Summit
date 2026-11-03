const BUILDER_LINK = "https://bit.ly/4vtn79b";
const FORM_LINK = "https://forms.gle/qFm7So1iU5mSnE6DA";

export default function AwsGoodies() {
  return (
    <section className="aws-goodies" aria-labelledby="aws-goodies-title">
      <div className="aws-goodies__intro">
        <div className="section-label">AWS BUILDER CENTER</div>
        <h2 id="aws-goodies-title">
          Claim your <span>goodies.</span>
        </h2>
        <p>
          Dev Summit is sponsored by AWS. Complete both steps below to receive
          your goodies.
        </p>
      </div>

      <div className="aws-goodies__content">
        <div className="aws-goodies__details">
          <ol className="aws-goodies__steps">
            <li>
              <span className="aws-goodies__step-number">01</span>
              <div>
                <h3>Create your profile</h3>
                <p>
                  Register for a new AWS Builder Center profile using the{" "}
                  <a
                    href={BUILDER_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    official registration link
                  </a>
                  . Your registration must be new and completed through this
                  link.
                </p>
              </div>
            </li>
            <li>
              <span className="aws-goodies__step-number">02</span>
              <div>
                <h3>Send us your details</h3>
                <p>
                  Fill out the{" "}
                  <a href={FORM_LINK} target="_blank" rel="noopener noreferrer">
                    AWS Builder Center Details Form
                  </a>{" "}
                  so your details reach AWS.
                </p>
              </div>
            </li>
          </ol>

          <a
            href={BUILDER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="aws-goodies__cta"
          >
            Register on AWS Builder Center <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="aws-goodies__visual">
          <span className="aws-goodies__visual-label">BUILD WHAT&apos;S NEXT</span>
          <div className="aws-goodies__logo-card">
            <img src="/assets/AWS_Logo.png" alt="Amazon Web Services" />
          </div>
          <p>One small step. A little something for your next big idea.</p>
        </div>
      </div>
    </section>
  );
}
