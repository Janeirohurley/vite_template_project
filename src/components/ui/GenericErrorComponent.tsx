import React from 'react';

export default function GenericErrorComponent({ error }: { error?: any }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
      <h2>Une erreur est survenue !</h2>
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </div>
  );
}
