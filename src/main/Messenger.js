import {useRef, useState} from "react";
import ConversationArea from "../conversation/ConversationArea";
import ContactsArea from "../contacts_list/ContactsArea";
import '../index.css';
import EmptyConversationArea from "../conversation/output/EmptyConversationArea";
import ContactDialog from "../contacts_list/ContactDialog";


export default function Messenger() {

    const [showContactDialog, setShowContactDialog] = useState(false);
    const editingContactIndex = useRef(-1);
    const [data,setData] = useState(defaultData)
    const [currentConversationIndex, setCurrentConversationIndex] = useState(-1);
    const nextContactId = useRef(4);


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
            conversations.push({history: "", draftedMessage: ""});
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

const defaultData =
    {
        contacts:
            [
            {
                id: 0, firstName: "Joshua", lastName: "Newman"
            },
            {
                id: 1, firstName: "Billy", lastName: "Jimmun"
            },
            {
                id: 2, firstName: "Clementine", lastName: "Flapcock"
            },
            {
                id: 3, firstName: "Audrey", lastName: "Scrollard"
            }
        ],
        conversations:
        [
            {
                id: 1000, history: "J", draftedMessage: "J"
            },
            {
                id: 1001, history: "B", draftedMessage: "B"
            },
            {
                id: 1002, history: "C", draftedMessage: "C"
            },
            {
                id: 1003, history: "A", draftedMessage: "A"
            }
        ]
    }