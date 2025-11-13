export default function Custom500() {
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
        }}>500</h1>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          margin: '1rem 0',
          color: '#1a1a1a'
        }}>Server Error</h2>
        <p style={{
          fontSize: '1.125rem',
          color: '#666',
          margin: '1.5rem 0 2rem',
          lineHeight: 1.6
        }}>
          Oops! Something went wrong on our end. We're working to fix it.
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
          <button 
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            style={{
              padding: '0.875rem 2rem',
              background: 'white',
              color: '#c41e3a',
              borderRadius: '6px',
              fontWeight: 600,
              border: '2px solid #c41e3a',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            If this problem persists, please contact our support team:
          </p>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            <strong>Email:</strong> <a href="mailto:customerservice@success.com" style={{ color: '#c41e3a', textDecoration: 'none', fontWeight: 600 }}>customerservice@success.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

