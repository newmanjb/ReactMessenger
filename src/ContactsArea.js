export default function ContactsArea({contacts:contactsList, onSelectedContactChange:onSelectedContactChangeFunction}) {

    let contactRows = [];
    for(let i = 0; i < contactsList.length; i++) {
        let contact = contactsList[i];
        contactRows.push(<li key={contact.id}>
            <button onClick={() => {
                onSelectedContactChangeFunction(i)
            }}>{contact.firstname + " " + contact.lastname}</button>
        </li>);
    }

    return (
        <ul>
            {
                contactRows
            }
        </ul>
    );
}

