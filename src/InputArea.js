import {useState} from "react";


export default function InputArea({conversation : conversationDetails, onSend : send}) {

    const [, setDraftedMessage] = useState(conversationDetails.draftedMessage);

    return (
        <div>
            <div>
                <input name="message" value={conversationDetails.draftedMessage} onChange={e => {
                    conversationDetails.draftedMessage = e.target.value;
                    setDraftedMessage(conversationDetails.draftedMessage);
                }}/>
                <button onClick={e => {
                    send();
                }}>Send
                </button>
            </div>
        </div>
    );
}