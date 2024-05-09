import { useEffect, useRef } from "react";

function useKey(key, cb) {
  const callback = useRef(cb);

  useEffect(() => {
    callback.current = cb;
  });

  useEffect(() => {
    function handle(event) {
      event.preventDefault();
      if (key === "ctrls" && event.key === "s" && event.ctrlKey) {
        console.log("fired");
        callback.current(event);
      } else {
        document.body.tabIndex = 0;
      }
    }

    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key]);
}

export default useKey;
