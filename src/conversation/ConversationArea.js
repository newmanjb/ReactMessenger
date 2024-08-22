import OutputArea from "./output/OutputArea";
import {useState} from "react";
import InputArea from "./input/InputArea";

export default function ConversationArea({conversation:conversationDetails}) {


    const [conversationHistory, setConversationHistory] = useState(conversationDetails.history);


    function onSend() {
        let newConversation = conversationHistory + "\n" + conversationDetails.draftedMessage;
        conversationDetails.history = newConversation;
        conversationDetails.draftedMessage = "";
        setConversationHistory(newConversation);
    }

    return (
        <div className="conversation-container">
            <div>
                <OutputArea outputText={conversationDetails.history}/>
            </div>
            <div>
                <InputArea conversation={conversationDetails} onSend={onSend}/>
            </div>
        </div>
    );
}