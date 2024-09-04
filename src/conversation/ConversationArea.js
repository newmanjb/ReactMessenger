import OutputArea from "./output/OutputArea";
import {useContext} from "react";
import InputArea from "./input/InputArea";
import {SendMessageContext} from "../main/Messenger";

export default function ConversationArea({conversation:conversationDetails}) {


    const sendJsonMessage = useContext(SendMessageContext);


    function onSend() {
        let newConversation = conversationDetails.history + "\n" + conversationDetails.draftedMessage;
        //Make sure the drafted message gets wiped
        let updateMsg = {type : "ConversationUpdate", update : {id:conversationDetails.id, newHistory : newConversation, newDraftedMessage: ""}};
        sendJsonMessage(updateMsg);
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