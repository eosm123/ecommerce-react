import { useFlashMessage } from "./FlashMessageStore";
// import { useEffect } from "react";

export default function FlashMessage() {
  const { getMessage } = useFlashMessage();
  const message = getMessage();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       clearMessage();
//     }, 3000);

//     // can return a CLEANUP FUNCTION for useEffect: the cleanup function is called when the effect triggers
//     // or when the effect ends
//     return () => {
//       clearTimeout(timer); // stop the timer if the effects run again
//     };
//   }, [getMessage, clearMessage]);
//   // When component detects that the dependency has changed, it will trigger useEffect again

  return (
    <>
      {message.message && (
        <div className={`alert alert-${message.type}`}>{message.message}</div>
      )}
    </>
  );
}
