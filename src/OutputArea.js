export default function OutputArea({outputText = ""}) {

    return (
        <div className="messager">
            <div>
                <textarea
                    className="outputViewer"
                    readOnly={true}
                    value={outputText}/>
            </div>
        </div>
    );
}