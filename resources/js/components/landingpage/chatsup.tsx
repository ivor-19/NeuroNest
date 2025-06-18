import React, { useEffect } from 'react';

const BotpressChat = () => {
  useEffect(() => {
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
    injectScript.defer = true;

    injectScript.onload = () => {
      const configScript = document.createElement('script');
      configScript.src = 'https://files.bpcontent.cloud/2025/06/17/13/20250617130800-1WUKJE4F.js';
      configScript.defer = true;
      document.head.appendChild(configScript);
    };

    document.head.appendChild(injectScript);

    return () => {
      document.head.removeChild(injectScript);
    };
  }, []);

  return <div id="botpress-webchat" />;
};

export default BotpressChat;
