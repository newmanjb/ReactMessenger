import {useState} from "react";
import ConversationArea from "../conversation/ConversationArea";
import ContactsArea from "../contacts_list/ContactsArea";
import '../index.css';
import EmptyConversationArea from "../conversation/output/EmptyConversationArea";


export default function Messenger() {

    const [data,setData] = useState(defaultData)
    const [currentConversationIndex, setCurrentConversationIndex] = useState(-1);

    function onContactSelected(index) {
        setCurrentConversationIndex(index);
    }

    function onContactRemoved(index) {
        var newCurrentConversationIndex = index === currentConversationIndex ? -1 : (index < currentConversationIndex ? currentConversationIndex - 1 : currentConversationIndex);
        setCurrentConversationIndex(newCurrentConversationIndex);
        let newContacts = data.contacts.toSpliced(index, 1);
        let newConversations = data.conversations.toSpliced(index, 1);
        let newData = {...data, contacts: newContacts, conversations: newConversations};
        setData(newData);
    }

    return (

        <div className="messenger-container">
            <>
                <ContactsArea contacts={data.contacts} onContactSelected={onContactSelected} onContactRemoved={onContactRemoved}/>
            </>

            <>
                {
                    currentConversationIndex > -1 ?
                        <ConversationArea key={data.contacts[currentConversationIndex].id} conversation={data.conversations[currentConversationIndex]}/>
                    : <EmptyConversationArea/>
                }
            </>)


        </div>
    );
}

const defaultData =
    {
        contacts:
        [
            {
                id: 0, firstname: "Joshua", lastname: "Newman"
            },
            {
                id: 1, firstname: "Billy", lastname: "Jimmun"
            },
            {
                id: 2, firstname: "Clementine", lastname: "Flapcock"
            },
            {
                id: 3, firstname: "Audrey", lastname: "Scrollard"
            }
        ],
        conversations:
        [
            {
                history: "J", draftedMessage: "J"
            },
            {
                history: "B", draftedMessage: "B"
            },
            {
                history: "C", draftedMessage: "C"
            },
            {
                history: "A", draftedMessage: "A"
            }
        ]
    }