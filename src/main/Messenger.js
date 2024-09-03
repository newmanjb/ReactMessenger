import {useEffect, useRef, useState} from "react";
import ConversationArea from "../conversation/ConversationArea";
import ContactsArea from "../contacts_list/ContactsArea";
import '../index.css';
import EmptyConversationArea from "../conversation/output/EmptyConversationArea";
import ContactDialog from "../contacts_list/ContactDialog";
import useWebSocket from 'react-use-websocket';



export default function Messenger() {

    const [showContactDialog, setShowContactDialog] = useState(false);
    const editingContactIndex = useRef(-1);
    const [data,setData] = useState(emptyData)
    const [currentConversationIndex, setCurrentConversationIndex] = useState(-1);
    const nextContactId = useRef(4);
    const nextConversationId = useRef(1004);

    const socketUrl = 'ws://127.0.0.1:8080';
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);

    //The 2 effects below get the initial set of data from the server.  From then on it's maintained in the UI and not
    //updated on the server.  The next stage will be to have all updates in the UI sent to the server first, and for the server
    // to then publish those updates and the UI to update itself based on these.
    useEffect(() => {
        sendJsonMessage({type: "RequestFullSnapshot"})
    }, [sendJsonMessage]);

    useEffect(() => {
        if(lastJsonMessage) {
            setData(buildUIDataFromServerData(lastJsonMessage))
        }
    }, [lastJsonMessage])

    function buildUIDataFromServerData(serverData) {
        const contacts = [];
        serverData.contacts.forEach(entry => {
            contacts.push({
                id: entry.id,
                firstName: entry.contactDetails.firstName,
                lastName : entry.contactDetails.lastName
            })
        })

        const conversations = [];
        serverData.conversations.forEach(entry => {
           conversations.push({
               id: entry.id,
               history : entry.conversationDetails.history,
               draftedMessage : entry.conversationDetails.draftedMessage
           })
        });

        return {
            contacts : contacts,
            conversations : conversations
        }
    }

    function onContactSelected(index) {
        setCurrentConversationIndex(index);
    }

    function onContactRemoveSelected(index) {
        var newCurrentConversationIndex = index === currentConversationIndex ? -1 : (index < currentConversationIndex ? currentConversationIndex - 1 : currentConversationIndex);
        setCurrentConversationIndex(newCurrentConversationIndex);
        let newContacts = data.contacts.toSpliced(index, 1);
        let newConversations = data.conversations.toSpliced(index, 1);
        let newData = {...data, contacts: newContacts, conversations: newConversations};
        setData(newData);
    }

    function onContactAddSelected() {
        setShowContactDialog(true);
    }

    function onContactEditSelected(indexSelected) {
        editingContactIndex.current = indexSelected;
        setShowContactDialog(true);
    }

    function onContactDialogCommit({firstName, lastName}) {
        let contacts = data.contacts;
        if(editingContactIndex.current > -1) {
            var contactId = contacts[editingContactIndex.current].id;
            contacts[editingContactIndex.current] = {id: contactId, firstName : firstName, lastName : lastName};
            editingContactIndex.current = -1;
        }
        else {
            let conversations = data.conversations;
            conversations.push({id : ++nextConversationId.current, history: "", draftedMessage: ""});
            contacts.push({id : ++nextContactId.current, firstName : firstName, lastName : lastName});
        }

        let newData =  {conversations : data.conversations, contacts: contacts};
        setData(newData);

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
                    firstName={editingContactIndex.current > -1 ? data.contacts[editingContactIndex.current].firstName : ""}
                    lastName={editingContactIndex.current > -1 ? data.contacts[editingContactIndex.current].lastName : ""}
                >
                </ContactDialog>)
            }


            <>
                <ContactsArea contacts={data.contacts}
                              onContactSelected={onContactSelected}
                              onContactRemoveSelected={onContactRemoveSelected}
                              onContactAddSelected={onContactAddSelected}
                              onContactEditSelected={onContactEditSelected}
                              selectedContactIndex={currentConversationIndex}
                />
            </>

            <>
                {
                    currentConversationIndex > -1 ?
                        <ConversationArea key={data.contacts[currentConversationIndex].id}
                                          conversation={data.conversations[currentConversationIndex]}/>
                        : <EmptyConversationArea/>
                }
            </>
            )

        </div>
    );
}

const emptyData =
    {
        contacts:
            [],
        conversations:
            []
    }