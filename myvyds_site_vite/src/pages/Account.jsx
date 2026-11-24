import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Account />
  </StrictMode>,
)

function Account() {
  return (
    <>
      <h1>Hello World!</h1>
    </>
  );
}
