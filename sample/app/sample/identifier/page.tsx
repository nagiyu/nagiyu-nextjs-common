'use client';

import { useState, useEffect } from 'react';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.client';

export default function IdentifierPage() {
  const [identifier, setIdentifier] = useState<string>('Loading...');
  const [terminalId, setTerminalId] = useState<string>('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await IdentifierUtil.getIdentifier();
        setIdentifier(id);

        const tId = await IdentifierUtil.getTerminalId();
        setTerminalId(tId);
      } catch (error) {
        setIdentifier('Error: ' + error);
        setTerminalId('Error: ' + error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Identifier Test Page</h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Identifier (User ID or Terminal ID):</h2>
        <p style={{ 
          fontFamily: 'monospace', 
          backgroundColor: '#f0f0f0', 
          padding: '10px',
          borderRadius: '5px'
        }}>
          {identifier}
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Terminal ID:</h2>
        <p style={{ 
          fontFamily: 'monospace', 
          backgroundColor: '#f0f0f0', 
          padding: '10px',
          borderRadius: '5px'
        }}>
          {terminalId}
        </p>
      </div>

      <div style={{ marginTop: '20px', color: '#666' }}>
        <p><strong>Note:</strong></p>
        <ul>
          <li>If you are logged in, the identifier should be your User ID</li>
          <li>If you are not logged in, the identifier should be the same as Terminal ID</li>
          <li>Terminal ID is always shown and should be consistent across page reloads</li>
        </ul>
      </div>
    </div>
  );
}
