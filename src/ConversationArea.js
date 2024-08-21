import OutputArea from "./OutputArea";
import {useState} from "react";
import InputArea from "./InputArea";

export default function ConversationArea({conversation:conversationDetails}) {


    const [conversationHistory, setConversationHistory] = useState(conversationDetails.history);


    function onSend() {
        let newConversation = conversationHistory + "\n" + conversationDetails.draftedMessage;
        conversationDetails.history = newConversation;
        conversationDetails.draftedMessage = "";
        setConversationHistory(newConversation);
    }

    return (
        <div>
            <div>
                <InputArea conversation={conversationDetails} onSend={onSend}/>
            </div>
            <div>
                <OutputArea outputText={conversationDetails.history}/>
            </div>
        </div>
    );
}