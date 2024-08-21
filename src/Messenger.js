import {useState} from "react";
import ConversationArea from "./ConversationArea";
import ContactsArea from "./ContactsArea";


export default function Messenger() {

    const [contacts,] = useState(defaultData.map(data => {return data.contact}))
    const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

    function onContactSelected(index) {
        setCurrentConversationIndex(index);
    }

    let selectedData = defaultData[currentConversationIndex];
    return (
        <>
            <section>
                <ContactsArea contacts={contacts} onSelectedContactChange={onContactSelected}/>
            </section>
            <section>
                <ConversationArea key={selectedData.contact.id} conversation={selectedData.conversation}/>
            </section>
        </>
    );
}

const defaultData = [
    {contact : {id: 0, firstname : "Joshua", lastname: "Newman"}, conversation : {history: "", draftedMessage: ""}},
    {contact : {id: 1, firstname : "Billy", lastname: "Jimmun"}, conversation : {history: "", draftedMessage: ""}},
    {contact : {id: 2, firstname : "Clementine", lastname: "Flapcock"}, conversation : {history: "", draftedMessage: ""}},
    {contact : {id: 3, firstname:"Audrey", lastname:"Scrollard"}, conversation : {history: "", draftedMessage: ""}}];
