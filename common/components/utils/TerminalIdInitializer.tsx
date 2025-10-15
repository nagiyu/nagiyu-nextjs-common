'use client';

import { useEffect } from 'react';

import TerminalUtil from '@client-common/utils/TerminalUtil.client';

export default function TerminalIdInitializer() {
  useEffect(() => {
    TerminalUtil.getTerminalId();
  }, []);

  return null;
}
