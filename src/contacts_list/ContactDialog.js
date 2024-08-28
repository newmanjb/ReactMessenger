// Modal as a separate component
import {useEffect, useRef} from "react";

export default function ContactDialog({onCancelContactDialog, onCommitContactDialog, firstName, lastName }) {

    const inputsRef = useRef({firstName, lastName});
    const dialogRef = useRef();

    //Call through to the browser API to close the dialog
    function closeDialog() {
        dialogRef.current?.close();
    }

    //Need to call through to the browser API to show the modal (empty dependencies parameter means the effect is only run once)
    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    return (
        <dialog
            className="contact-dialog"
            ref={dialogRef}
            title="Contact"
            onCancel={e => {
                closeDialog();
                onCancelContactDialog();
            }}
        >
            <div className="contact-dialog-widget">
                <label>
                    First Name:
                    <input  defaultValue={inputsRef.current.firstName} onChange={ceh => {
                        inputsRef.current.firstName = ceh.target.value
                }}/>
                </label>
            </div>
            <div className="contact-dialog-widget">
                <label>
                    Last Name:
                    <input defaultValue={inputsRef.current.lastName} onChange={ceh => {
                        inputsRef.current.lastName = ceh.target.value
                    }}/>
                </label>
            </div>
            <div className="contact-dialog-widget">
                <button onClick={e => {
                    closeDialog();
                    onCommitContactDialog(inputsRef.current);
                }}>
                    Commit
                </button>
            </div>
            <div className="contact-dialog-widget">
                <button onClick={e => {
                    closeDialog();
                    onCancelContactDialog();
                }}>
                    Cancel
                </button>
            </div>
        </dialog>
    );
}