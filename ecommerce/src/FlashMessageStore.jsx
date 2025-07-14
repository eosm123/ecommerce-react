// An atom in jotai is an indivisible unit of data that is to be stored
// When one part of the 'atom' changes it counts as if the entire data has changed -> v similar to state
import { atom, useAtom } from "jotai";

// Creating an atom - contains the data you want to share
// But dont want to share directly to the diff components due to validation -> ensure that theres 2 keys
export const flashMessageAtom = atom({
  // Atom can store anyth -> int, str, float, array, obj, etc.
  message: "",
  type: "info", // possible values: info, danger or success
});

// Creating functions to share the functions to the component, then other components will use these function
// to update atom
// Below is a custom React Hook -> a function that creates arrow functions
// When useFlashMessage is called -> create the 3 functions (for CRUD) -> 
// and memorise the values of flashMessage and setFlashMessage and return
export const useFlashMessage = () => {
  const [flashMessage, setFlashMessage] = useAtom(flashMessageAtom);

  // Set the current messsage that we are showing
  const showMessage = (message, type) => {
    // if message is defined and type is either one of those in the array
    if (message && ["info", "success", "danger"].includes(type)) {
      setFlashMessage({
        'message': message,
        'type': type
      });
    }

    // 3 seconds later, we will reset the flash message
    setTimeout(() => {
        clearMessage()
    }, 3000)
  };
  const clearMessage = () => {
    setFlashMessage({
        message: '',
        type: 'info'
    })
  }

  const getMessage = () => {
    return flashMessage
  }

  return {
    getMessage, showMessage, clearMessage, flashMessage

  }

};
