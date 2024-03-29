import React from "react";

function CreateArea(props) {

    //Create stateful constants (object that contains both the title and content):
    const [note, setNote] = useState({
        title: "",
        content: ""
    });

    function handleChange(event){
        //Destructure the event to get hold of the event.target.name and event.target.value
        const {name, value} = event.target;

        //Add to the note by calling setNote()
        //Receives the previous note and is then used to add to the existing note.
        //The [name]: value syntax below turns the name key from just the string value to the actual value of the name constant. 
        setNote(prevNote => {
            return {
                ...prevNote, 
                [name]: value
            };
        });
    }

    function submitNote(event){
        //onAdd() in the App.jsx file is triggered by the props in line 3 above.
        props.onAdd(note);
        event.preventDefault();
    }

    return (
        <div>
            <form>
                <input name="title" onChange={handleChange} value={note.title} placeholder="Title"></input>
                <textarea name="content" onChange={handleChange} value={note.content} placeholder="Take a note..." rows="3"></textarea>
                <button onClick={submitNote}>Add</button>
            </form>
        </div>
    );
}

export default CreateArea;
