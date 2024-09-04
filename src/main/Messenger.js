import {createContext, useEffect, useRef, useState} from "react";
import ConversationArea from "../conversation/ConversationArea";
import ContactsArea from "../contacts_list/ContactsArea";
import '../index.css';
import EmptyConversationArea from "../conversation/output/EmptyConversationArea";
import ContactDialog from "../contacts_list/ContactDialog";
import useWebSocket from 'react-use-websocket';


export const SendMessageContext = createContext(null);


export default function Messenger() {

    //The main data model
    const [uiData,setUiData] = useState(emptyUIData)
    //True if the user is editing or adding a contact
    const [showContactDialog, setShowContactDialog] = useState(false);
    //The position of the contact being edited in the contacts list
    const editingContactIndex = useRef(-1);
    //The currently selected conversation
    const [currentConversationIndex, setCurrentConversationIndex] = useState(-1);
    const nextContactId = useRef(4);
    const nextConversationId = useRef(1004);
    //Used to find the conversation or contact that messages from the server are referring to more easily
    const contactIdsToIndices = useRef(new Map());
    const conversationIdsToIndices = useRef(new Map());

    const socketUrl = 'ws://127.0.0.1:8080';
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);

    //The effect below gets the initial set of data from the server.  From then on it's maintained in the UI and not
    //updated on the server.  The next stage will be to have all updates in the UI sent to the server first, and for the server
    // to then publish those updates and the UI to update itself based on these.
    useEffect(() => {
        sendJsonMessage({type: "RequestFullSnapshot"})
    }, [sendJsonMessage]);
    //Listen for messages from the server
    useEffect(() => {
        if(lastJsonMessage) {
            let newData = createNewDataFromServerMsg(lastJsonMessage);
            if(newData) {
                setUiData(newData);
            }
        }
    }, [lastJsonMessage])

    //Logs an error and returns null if the message is invalid
    function createNewDataFromServerMsg(serverMsg) {
        switch(serverMsg.type) {
            //Build new ui data from scratch
            case "FullSnapshot" : {
                const contacts = [];

                for (let i = 0; i < serverMsg.data.contacts.length; i++) {
                    let entry = serverMsg.data.contacts[i];
                    contacts.push({
                        id: entry.id,
                        firstName: entry.contactDetails.firstName,
                        lastName: entry.contactDetails.lastName
                    });
                    contactIdsToIndices.current.set(entry.id, i);
                }

                const conversations = [];
                for (let i = 0; i < serverMsg.data.conversations.length; i++) {
                    let entry = serverMsg.data.conversations[i];
                    conversations.push({
                        id: entry.id,
                        history: entry.conversationDetails.history,
                        draftedMessage: entry.conversationDetails.draftedMessage
                    })
                    conversationIdsToIndices.current.set(entry.id, i);
                }
                return {
                    contacts: contacts,
                    conversations: conversations
                }
            }
            case "ConversationUpdate" : {
                let conversationIndex = conversationIdsToIndices.current.get(serverMsg.update.id);
                let conversation = uiData.conversations[conversationIndex];
                conversation.history = serverMsg.update.newHistory;
                conversation.draftedMessage = serverMsg.update.newDraftedMessage;
                return {...uiData};
            }
            default : {
                console.log("Unknown message type: " + serverMsg)
                return null;
            }
        }
    }

    function onContactSelected(index) {
        setCurrentConversationIndex(index);
    }

    function onContactRemoveSelected(index) {
        var newCurrentConversationIndex = index === currentConversationIndex ? -1 : (index < currentConversationIndex ? currentConversationIndex - 1 : currentConversationIndex);
        setCurrentConversationIndex(newCurrentConversationIndex);
        let newContacts = uiData.contacts.toSpliced(index, 1);
        let newConversations = uiData.conversations.toSpliced(index, 1);
        let newData = {...uiData, contacts: newContacts, conversations: newConversations};
        setUiData(newData);
    }

    function onContactAddSelected() {
        setShowContactDialog(true);
    }

    function onContactEditSelected(indexSelected) {
        editingContactIndex.current = indexSelected;
        setShowContactDialog(true);
    }

    function onContactDialogCommit({firstName, lastName}) {
        let contacts = uiData.contacts;
        if(editingContactIndex.current > -1) {
            var contactId = contacts[editingContactIndex.current].id;
            contacts[editingContactIndex.current] = {id: contactId, firstName : firstName, lastName : lastName};
            editingContactIndex.current = -1;
        }
        else {
            let conversations = uiData.conversations;
            let newConversationId = ++nextConversationId.current;
            let newContactId = ++nextContactId.current;
            conversations.push({id : newConversationId, history: "", draftedMessage: ""});
            contacts.push({id : newContactId, firstName : firstName, lastName : lastName});
        }

        let newData =  {conversations : uiData.conversations, contacts: contacts};
        setUiData(newData);

        setShowContactDialog(false);
    }

    function onContactDialogCancel() {
        editingContactIndex.current = -1;
        setShowContactDialog(false);
    }

    return (

        <div className="messenger-container">

            {
                showContactDialog && (
                <ContactDialog
                    onCancelContactDialog={() => onContactDialogCancel()}
                    onCommitContactDialog={onContactDialogCommit}
                    firstName={editingContactIndex.current > -1 ? uiData.contacts[editingContactIndex.current].firstName : ""}
                    lastName={editingContactIndex.current > -1 ? uiData.contacts[editingContactIndex.current].lastName : ""}
                >
                </ContactDialog>)
            }


            <>
                <ContactsArea contacts={uiData.contacts}
                              onContactSelected={onContactSelected}
                              onContactRemoveSelected={onContactRemoveSelected}
                              onContactAddSelected={onContactAddSelected}
                              onContactEditSelected={onContactEditSelected}
                              selectedContactIndex={currentConversationIndex}
                />
            </>

            <>
                <SendMessageContext.Provider value={sendJsonMessage}>
                {
                        currentConversationIndex > -1 ?
                            <ConversationArea key={uiData.conversations[currentConversationIndex]} conversation={uiData.conversations[currentConversationIndex]}/>
                            : <EmptyConversationArea/>
                }
                </SendMessageContext.Provider>
            </>
            )

        </div>
    );
}

const emptyUIData =
    {
        contacts:
            [],
        conversations:
            []
    }