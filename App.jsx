import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";
import { onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );
  const [currentNoteId, setCurrentNoteId] = React.useState("");

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      const notesArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArray);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes.length > 0 ? notes[0].id : undefined);
    }
  });

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  async function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  function updateNote(text) {
    let newArray = [];
    setNotes((oldNotes) => {
      for (let i = 0; i < oldNotes.length; i++) {
        if (oldNotes[i].id === currentNoteId) {
          newArray.unshift({ ...oldNotes[i], body: text });
        } else {
          newArray.push(oldNotes[i]);
        }
      }
      return newArray;
    });
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          (
          <Editor currentNote={currentNote} updateNote={updateNote} />)
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
