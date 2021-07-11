// The donation itself and the donation message is send to a telegram bot to notify me
// This is a custom implementation on my server. You need to find your own way to send
// the notifications.

import React from "react";
import { Button, TextField } from '@material-ui/core';
import Loader from "react-loader-spinner";



export type Props = {

}

const DonationMessage: React.FC<Props> = ({ }: Props) => {
  const [text, setText] = React.useState<string>('');
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [isSent, setIsSent] = React.useState<boolean>(false);



  return (
    <div className="">
      <p className="font-bold text-center">Thank you for your donation!</p>
      {!isSent &&
        <div>
          <div className="mt-2">
            <TextField
              onChange={(event) => {
                setText(event.target.value);
              }}
              className="w-full"
              autoFocus multiline size="small" rows={5}
              placeholder="In case you want to leave a message." variant="outlined"
            />
          </div>

          <div className="mt-1">
            <Button className="w-full" color="primary" variant="contained"
              style={{height: '42px'}}
              disabled={!text || isSending}
              onClick={async () => {
                setIsSending(true);
                await telegram.sendMessageToOwner('Donation message', text);
                setIsSent(true);
              }}
            >
              {!isSending && <span>Send</span>}
              {isSending && <Loader type="ThreeDots" width="40px"></Loader>}
            </Button>
          </div>
        </div>
      }
      {isSent &&
        <div className="mt-2">Message sent.</div>
      }


    </div>
  );
}

export default DonationMessage;