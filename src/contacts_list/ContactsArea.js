import {useEffect, useState} from "react";

export default function ContactsArea({contacts:contactsList, onSelectedContactChange:onSelectedContactChangeFunction}) {

    const [showingContextMenu, setShowingContextMenu] = useState(false);
    const [contextMenuLocation, setContextMenuLocation] = useState({x:0,y:0});

    useEffect(() => {
        const removeContextMenu = () => {setShowingContextMenu(false)}
        window.addEventListener("click", removeContextMenu);
        return () => {window.removeEventListener("click", removeContextMenu)}
    }, [])

    let contactRows = [];
    for(let i = 0; i < contactsList.length; i++) {
        let contact = contactsList[i];
        contactRows.push(

            <button className="contacts-button"
                onClick={() => {
                    onSelectedContactChangeFunction(i)
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenuLocation({x: e.pageX, y: e.pageY, contact : contact});
                    setShowingContextMenu(true);
                }}>
                {
                    contact.firstname + " " + contact.lastname
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
                showingContextMenu &&
                (
                    <div className="contacts-context-menu"
                         style={{top: contextMenuLocation.y, left: contextMenuLocation.x}}>
                        <div className="contacts-context-menu-item" onClick={e => console.log("bollards")}>
                            Add New Contact
                        </div>
                        <div className="contacts-context-menu-item" onClick={e => console.log("bollards")}>
                            Remove Contact {contextMenuLocation.contact.firstname + " " + contextMenuLocation.contact.lastname}
                        </div>
                        <div className="contacts-context-menu-item" onClick={e => console.log("bollards")}>
                            Edit Contact {contextMenuLocation.contact.firstname + " " + contextMenuLocation.lastname}
                        </div>
                    </div>
                )
            }
            </div>
        </>
    );
}

