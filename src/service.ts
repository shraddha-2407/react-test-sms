// there's a proxy config in package.json that specifies all unknown requests are proxied to the sendsei api
// this means instead of making a call to https://api.transmitmessage.com/v1/sender you would call just /v1/sender
import { ISendSMSError, ISendSMSResponse } from './types';

export const sendSMS = async (
  sender: string,
  recipient: string,
  message: string
): Promise<ISendSMSResponse | ISendSMSError> => {
  const apiKey = process.env.REACT_APP_API_KEY || '';
  try {
    const response = await fetch('/v1/sms/message', {
      method: 'POST',
      headers: new Headers({ 
        'content-type': 'application/json', 
        'x-api-key': apiKey
      }),
      body: JSON.stringify({
        message, sender, recipient
      })
    });
    const sms = response.json();
    return sms;
  } catch (e) {
    return {
      error: e
    } as ISendSMSError;
  }
};
