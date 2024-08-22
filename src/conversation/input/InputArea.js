import {useState} from "react";


export default function InputArea({conversation : conversationDetails, onSend : send}) {

    const [, setDraftedMessage] = useState(conversationDetails.draftedMessage);

    return (
        <div className="conversation-input-container">
            <textarea
                className="conversation-input-field"
                value=
                    {
                        conversationDetails.draftedMessage
                    }
                onChange={(e) =>
                    {
                        setDraftedMessage(e.target.value);
                        conversationDetails.draftedMessage = e.target.value;
                    }
                }
            />
            <div className="send-button-container">
                <button className="send-button" onClick={e => {
                    send();
                }}>
                    Send
                </button>
            </div>
        </div>
    );
}