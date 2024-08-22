export default function ContactsArea({contacts:contactsList, onSelectedContactChange:onSelectedContactChangeFunction}) {

    let contactRows = [];
    for(let i = 0; i < contactsList.length; i++) {
        let contact = contactsList[i];
        contactRows.push(
            <button className="contacts-button" onClick={() => {
                onSelectedContactChangeFunction(i)
            }}>{contact.firstname + " " + contact.lastname}</button>);
    }

    return (
        <div className="contacts-list">
            {
                contactRows
            }
        </div>
    );
}

