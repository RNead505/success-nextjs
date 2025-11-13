import type { NextPage } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
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
        }}>{statusCode || 'Error'}</h1>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          margin: '1rem 0',
          color: '#1a1a1a'
        }}>
          {statusCode === 404 ? 'Page Not Found' : 'An Error Occurred'}
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: '#666',
          margin: '1.5rem 0 2rem',
          lineHeight: 1.6
        }}>
          {statusCode === 404
            ? "Sorry, we couldn't find the page you're looking for."
            : 'Oops! Something went wrong on our end.'}
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
        </div>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

