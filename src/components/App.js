import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";

function App() {

  const [init, setInit] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

  const [userObj, setUserObj] = useState(null);

  useEffect(() => {

    authService.onAuthStateChanged((user) => {

      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {

        setIsLoggedIn(false);

      }
      setInit(true);
    })
  }, []);

  console.log(isLoggedIn);

  const refreshUser = () => {

    const user = authService.currentUser;

    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args)
    });

  }

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."}
      <footer>&copy;{new Date().getFullYear()}ki MUSIUM</footer>
    </>

  );
}

export default App;
