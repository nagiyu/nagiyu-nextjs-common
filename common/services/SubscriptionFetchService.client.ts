import { SubscriptionDataType } from '@common/interfaces/data/SubscriptionDataType';

import ResponseValidator from '@client-common/utils/ResponseValidator';

export class SubscriptionFetchService {
  public async getByTerminalId(terminalId: string): Promise<SubscriptionDataType> {
    const response = await fetch(`/api/subscription?terminalId=${terminalId}`, {
      method: 'GET',
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }

  public async create(data: Partial<SubscriptionDataType>): Promise<SubscriptionDataType> {
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }

  public async update(id: string, data: Partial<SubscriptionDataType>): Promise<SubscriptionDataType> {
    const response = await fetch(`/api/subscription?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }

  public async delete(id: string): Promise<void> {
    const response = await fetch(`/api/subscription?id=${id}`, {
      method: 'DELETE',
    });

    ResponseValidator.ValidateResponse(response);
  }
}
