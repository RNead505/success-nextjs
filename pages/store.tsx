import { useEffect } from 'react';

export default function StorePage() {
  useEffect(() => {
    // Redirect to external SUCCESS+ shop
    window.location.href = 'https://mysuccessplus.com/shop';
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to SUCCESS Shop...</h1>
      <p>If you are not redirected automatically, <a href="https://mysuccessplus.com/shop">click here</a>.</p>
    </div>
  );
}
