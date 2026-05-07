export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="ds-auth-root">
      {/* Background blobs */}
      <div className="ds-auth-bg-blob-1" />
      <div className="ds-auth-bg-blob-2" />

      <div className="ds-auth-container">
        {/* Brand */}
        <div className="ds-auth-brand">
          <div className="ds-auth-logo">
            <span className="material-symbols-outlined">signal_cellular_alt</span>
          </div>
          <h1 className="ds-auth-title">
            BMP<span style={{ color: "var(--primary-container)" }}>net</span>
          </h1>
          <p className="ds-auth-subtitle">
            Masuk untuk mengelola layanan internet Anda
          </p>
        </div>

        {/* Login Card */}
        <div className="ds-auth-card">
          <form className="ds-auth-form" action="/api/auth/request-otp" method="POST">
            {/* Email field */}
            <div className="ds-field-group">
              <label className="ds-field-label" htmlFor="email">
                Email terdaftar
              </label>
              <div className="ds-input-wrap">
                <span className="material-symbols-outlined ds-input-icon">mail</span>
                <input
                  className="ds-input with-icon"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button className="ds-btn ds-btn-primary" type="submit" style={{ marginTop: 8 }}>
              Kirim Kode OTP
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </button>
          </form>

          <ErrorBlock searchParams={searchParams} />
        </div>

        {/* Footer */}
        <div className="ds-auth-footer">
          <div className="ds-auth-links">
            <a className="ds-auth-link" href="#">
              <span className="material-symbols-outlined">help_outline</span>
              Support
            </a>
            <div className="ds-auth-sep" />
            <a className="ds-auth-link" href="#">
              <span className="material-symbols-outlined">shield</span>
              Privasi
            </a>
          </div>
          <div className="ds-security-badge">
            <span
              className="material-symbols-outlined ds-text-secondary"
              style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="ds-label-caps ds-text-muted" style={{ fontSize: 10 }}>
              Terenkripsi 256-bit AES
            </span>
          </div>
        </div>
      </div>

      <div className="ds-version-tag">v2.4.0</div>
    </div>
  );
}

async function ErrorBlock({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  if (!params.error) return null;
  return (
    <div className="ds-alert ds-alert-error">
      {decodeURIComponent(params.error)}
    </div>
  );
}
