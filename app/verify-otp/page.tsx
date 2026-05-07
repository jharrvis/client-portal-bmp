export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; message?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="ds-auth-root">
      <div className="ds-auth-bg-blob-1" />
      <div className="ds-auth-bg-blob-2" />

      <div className="ds-auth-container">
        {/* Brand */}
        <div className="ds-auth-brand">
          <div className="ds-auth-logo">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <h1 className="ds-auth-title">Verifikasi OTP</h1>
          <p className="ds-auth-subtitle">
            Masukkan kode yang dikirim ke email Anda
          </p>
        </div>

        {/* Card */}
        <div className="ds-auth-card">
          {params.message && (
            <div className="ds-alert ds-alert-success">
              {decodeURIComponent(params.message)}
            </div>
          )}
          {params.error && (
            <div className="ds-alert ds-alert-error">
              {decodeURIComponent(params.error)}
            </div>
          )}

          <form
            className="ds-auth-form"
            action="/api/auth/verify-otp"
            method="POST"
            style={{ marginTop: params.message || params.error ? 16 : 0 }}
          >
            {/* Email */}
            <div className="ds-field-group">
              <label className="ds-field-label" htmlFor="email">Email</label>
              <div className="ds-input-wrap">
                <span className="material-symbols-outlined ds-input-icon">mail</span>
                <input
                  className="ds-input with-icon"
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={params.email ?? ""}
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* OTP Code */}
            <div className="ds-field-group">
              <label className="ds-field-label" htmlFor="otp">Kode OTP</label>
              <div className="ds-input-wrap">
                <span className="material-symbols-outlined ds-input-icon">pin</span>
                <input
                  className="ds-input with-icon"
                  id="otp"
                  type="text"
                  name="otp"
                  placeholder="123456"
                  inputMode="numeric"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            {/* Device Name */}
            <div className="ds-field-group">
              <label className="ds-field-label" htmlFor="device_name">Nama Device</label>
              <div className="ds-input-wrap">
                <span className="material-symbols-outlined ds-input-icon">phone_android</span>
                <input
                  className="ds-input with-icon"
                  id="device_name"
                  type="text"
                  name="device_name"
                  defaultValue="Portal Client"
                  required
                />
              </div>
            </div>

            <button className="ds-btn ds-btn-primary" type="submit" style={{ marginTop: 8 }}>
              Verifikasi &amp; Login
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="ds-auth-footer">
          <a className="ds-auth-link" href="/login">
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Login
          </a>
        </div>
      </div>

      <div className="ds-version-tag">v2.4.0</div>
    </div>
  );
}
