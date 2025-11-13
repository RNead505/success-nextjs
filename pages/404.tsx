export default function Custom404() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        background: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '8rem',
          fontWeight: 900,
          margin: 0,
          color: '#c41e3a',
          lineHeight: 1
        }}>404</h1>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          margin: '1rem 0',
          color: '#1a1a1a'
        }}>Page Not Found</h2>
        <p style={{
          fontSize: '1.125rem',
          color: '#666',
          margin: '1.5rem 0 2rem',
          lineHeight: 1.6
        }}>
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem 0' }}>
          <a href="/" style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: '#c41e3a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 600
          }}>
            Go Home
          </a>
          <a href="/contact" style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: 'white',
            color: '#c41e3a',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            border: '2px solid #c41e3a'
          }}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

