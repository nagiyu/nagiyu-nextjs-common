'use client';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ErrorAlert from '@client-common/components/feedback/alert/ErrorAlert';
import WarningAlert from '@client-common/components/feedback/alert/WarningAlert';
import SuccessAlert from '@client-common/components/feedback/alert/SuccessAlert';
import InfoAlert from '@client-common/components/feedback/alert/InfoAlert';

export default function AlertDemoPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Alert Components Demo</h1>
      <BasicStack>
        <ErrorAlert message="This is an error alert" />
        <WarningAlert message="This is a warning alert" />
        <SuccessAlert message="This is a success alert" />
        <InfoAlert message="This is an info alert" />
      </BasicStack>
    </div>
  );
}
