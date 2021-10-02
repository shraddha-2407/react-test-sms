import React from "react";
import MessageDisplay from "./MessageDisplay";
import MessageForm from "./MessageForm";
import { ISmsDetails } from './types';

const MessagePage = () => {
  const [arr, setArr] = React.useState<ISmsDetails[]>([]);

  const handleSMS = (details: ISmsDetails) => {
    setArr([...arr, details]);
  }

  return (
    <div className="MessagePage" data-testid='messagePage' >
      <MessageForm handleSendSms={handleSMS} />
      <MessageDisplay smsDetails={arr} />
    </div>
  );
};

export default MessagePage;
