import {useEffect, useState} from "react";

export default function ContactsArea({contacts, onContactSelected, onContactRemoveSelected, onContactAddSelected, onContactEditSelected}) {

    const [showingContextMenu, setShowingContextMenu] = useState(false);
    const [contextMenuInformation, setContextMenuInformation] = useState({x:0,y:0});

    //Adds a window listener that removes the context menu on left-click.  The effect is only run once as it has an empty dependency array.
    useEffect(() => {
        const removeContextMenu = () => {setShowingContextMenu(false)}
        window.addEventListener("click", removeContextMenu);
        return () => {window.removeEventListener("click", removeContextMenu)}
    }, [])

    let contactRows = [];
    for(let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        contactRows.push(

            <button className="contacts-button"

                key={i}
                onClick={() => {
                    onContactSelected(i)
                }}
                onContextMenu={(e) => {
                    //Stop the default context menu (from browser) from appearing
                    e.preventDefault();
                    //Gather the information that's used when rendering the menu
                    setContextMenuInformation({x: e.pageX, y: e.pageY, contact : contact, contactIndex : i});
                    setShowingContextMenu(true);
                }}>
                {
                    contact.firstName + " " + contact.lastName
                }
            </button>);
    }

    return (
        <>
            <div className="contacts-list">
            {
                contactRows
            }
            {
                //conditional rendering
                showingContextMenu &&
                (
                    <div className="contacts-context-menu"
                         style={{top: contextMenuInformation.y, left: contextMenuInformation.x}}>
                        <div className="contacts-context-menu-item" onClick={e => onContactAddSelected()}>
                            Add New Contact
                        </div>
                        <div className="contacts-context-menu-item" onClick={e => onContactEditSelected(contextMenuInformation.contactIndex)}>
                            Edit Contact {contextMenuInformation.contact.firstName + " " + contextMenuInformation.contact.lastName}
                        </div>
                        <div className="contacts-context-menu-item" onClick={e => onContactRemoveSelected(contextMenuInformation.contactIndex)}>
                            Remove Contact {contextMenuInformation.contact.firstName + " " + contextMenuInformation.lastName}
                        </div>
                    </div>
                )
            }
            </div>
        </>
    );
}

