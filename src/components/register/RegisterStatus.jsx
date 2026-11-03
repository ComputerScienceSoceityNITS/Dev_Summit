export default function RegisterStatus({
  actionDisabled = false,
  actionHref,
  actionLabel,
  error,
  message,
  onAction,
  title,
  secondaryActionHref,
  secondaryActionLabel,
  secondaryActionExternal = false,
}) {
  return (
    <div className="reg-card reg-done">
      {title && <h3>{title}</h3>}
      {message && <p>{message}</p>}
      {error && (
        <p className="reg-err" role="alert">
          {error}
        </p>
      )}
      <div className="reg-actions-row">
        {actionHref && (
          <a className="reg-btn" href={actionHref}>
            {actionLabel}
          </a>
        )}
        {onAction && (
          <button
            className="reg-btn"
            type="button"
            disabled={actionDisabled}
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
        {secondaryActionHref && (
          <a
            className="reg-btn ghost-dark"
            href={secondaryActionHref}
            target={secondaryActionExternal ? "_blank" : undefined}
            rel={secondaryActionExternal ? "noopener noreferrer" : undefined}
          >
            {secondaryActionLabel}
          </a>
        )}
      </div>
    </div>
  );
}
