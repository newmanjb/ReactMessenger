import OutputArea from "./output/OutputArea";
import {useContext} from "react";
import InputArea from "./input/InputArea";
import {SendMessageContext} from "../main/Messenger";

export default function ConversationArea({conversation:conversation}) {


    const sendJsonMessage = useContext(SendMessageContext);


    function onSend() {
        let newConversation = [...conversation.history];
        newConversation.push({text : conversation.draftedMessage});
        //The drafted message has been sent, so it should now be empty
        let updateMsg = "type=ConversationUpdate " + JSON.stringify( {id: conversation.id, conversationDetails: {history : newConversation, draftedMessage:''}});
        sendJsonMessage(updateMsg);
    }

    return (
        <div className="conversation-container">
            <div>
                <OutputArea conversationHistory={conversation.history}/>
            </div>
            <div>
                <InputArea conversation={conversation} onSend={onSend}/>
            </div>
        </div>
    );
}