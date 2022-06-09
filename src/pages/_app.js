import "../styles/globals.css"
import Head from "next/head"
import { useRef, useState } from "react"
import { GlobalContext } from "../config/context"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { cacheUserData, signOut } from "../scripts/user"


const firebaseConfig = {
  apiKey: "AIzaSyBb2fDd8zhtmE_YbBB2hlRg9pTHR0YXzfo",
  authDomain: "obvescevalnik.firebaseapp.com",
  projectId: "obvescevalnik",
  storageBucket: "obvescevalnik.appspot.com",
  messagingSenderId: "862455134750",
  appId: "1:862455134750:web:7fba0ae14d02f2c18b4c0f",
  measurementId: "G-G7TCT7PMSY"
};
initializeApp(firebaseConfig)

function MyApp({ Component, pageProps }) {
	const auth = getAuth()

	const isProcessing = useRef(false)
	const [state, setState] = useState({
		username: undefined,
		obcina: undefined,
		permissions: [],
		token: undefined,
		uid: undefined,
		update,
	})

	function update(data) {
		setState(Object.assign({}, state, data))
	}

	onAuthStateChanged(auth, (user) => {
		if (user && !state.token && !isProcessing.current) {
			isProcessing.current = true
			cacheUserData(auth.currentUser, state)
				.catch((error) => {
					console.error(error)
					try {
						signOut(auth)
					} catch {}
				})
				.finally(() => {
					isProcessing.current = false
				})
		} else if (!user && state.token) {
			state.update({
				...state,
				username: undefined,
				obcina: undefined,
				permissions: [],
				token: undefined,
				uid: undefined,
			})
		}
	})

	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<GlobalContext.Provider value={state}>
				<Component {...pageProps} />
			</GlobalContext.Provider>
			{/* <script
        async
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
      ></script> */}
		</>
	)
}

export default MyApp
