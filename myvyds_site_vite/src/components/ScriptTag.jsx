import { useEffect } from 'react';

export default function BodiedScriptTag({ scriptText }) {
  useEffect(() => {
    const script = document.createElement('script');
    const node = document.createTextNode(scriptText);
    script.appendChild(node);
    document.body.appendChild(script);

    // Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="widget-container-s" />;
}
