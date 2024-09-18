export default function OutputArea({conversationHistory}) {

    let outputText = "";
    for(let i = 0; i < conversationHistory.length; i++) {
        var msg = conversationHistory[i];
        outputText =  outputText + msg.text + "\n";
    }

    return (
        <textarea
            className="conversation-history-text-area"
            readOnly={true}
            value={outputText}/>
    );
}