import React from "react";
import { ISmsDetails } from './types';

interface Props {
  smsDetails: ISmsDetails[]
}

const MessageDisplay: React.FC<Props> = ({smsDetails}: Props) => {
  return (
    <div className="MessageDisplay" data-testid='messageDisplay' >
      <header>Sent SMS</header>
      {smsDetails.length > 0 ? smsDetails.map((detail, index) => {
          return (
            <div className="messageDetails" data-testid='messageDetails' key={index}>
              <div>
                Recipient: {detail.recipient}
              </div>
              <div>
                Message: {detail.message}
              </div>
              <div>
                Cost: {detail.cost}
              </div>
            </div>
          )
        }
      ): <div className="messageDetails" data-testid='initialMessage'>
        Welcome, Send your first SMS!
      </div>
      }
    </div>
  );
};

export default MessageDisplay;

