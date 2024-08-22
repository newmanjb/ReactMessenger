import {useState} from "react";
import ConversationArea from "../conversation/ConversationArea";
import ContactsArea from "../contacts_list/ContactsArea";
import '../index.css';


export default function Messenger() {

    const [contacts,] = useState(defaultData.map(data => {return data.contact}))
    const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

    function onContactSelected(index) {
        setCurrentConversationIndex(index);
    }

    let selectedData = defaultData[currentConversationIndex];
    return (
        <div className="messenger-container">
            <>
                <ContactsArea contacts={contacts} onSelectedContactChange={onContactSelected}/>
            </>
            <>
                <ConversationArea key={selectedData.contact.id} conversation={selectedData.conversation}/>
            </>
        </div>
    );
}

const defaultData = [
    {contact : {id: 0, firstname : "Joshua", lastname: "Newman"}, conversation : {history: "", draftedMessage: ""}},
    {contact : {id: 1, firstname : "Billy", lastname: "Jimmun"}, conversation : {history: "", draftedMessage: ""}},
    {contact : {id: 2, firstname : "Clementine", lastname: "Flapcock"}, conversation : {history: "", draftedMessage: ""}},
    {contact : {id: 3, firstname:"Audrey", lastname:"Scrollard"}, conversation : {history: "", draftedMessage: ""}}];
