function ProfileDetail({ label, value }) {
  return (
    <div className="profile-detail">
      <span>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

export default function ProfileDetails({ user }) {
  return (
    <section className="profile-panel" aria-labelledby="profile-details-title">
      <h3 id="profile-details-title">Account details</h3>
      <div className="profile-details">
        <ProfileDetail label="Name" value={user.name} />
        <ProfileDetail label="Email" value={user.email} />
        <ProfileDetail label="Scholar ID" value={user.scholarId} />
        <ProfileDetail
          label="Account type"
          value={user.role ? user.role[0].toUpperCase() + user.role.slice(1) : ""}
        />
      </div>
    </section>
  );
}
