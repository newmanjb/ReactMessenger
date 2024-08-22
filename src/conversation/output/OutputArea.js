export default function OutputArea({outputText = ""}) {

    return (
        <textarea
            className="conversation-history-text-area"
            readOnly={true}
            value={outputText}/>
    );
}