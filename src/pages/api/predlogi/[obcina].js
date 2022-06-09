import Firestore from "@google-cloud/firestore"
import firebase from "firebase-admin"

if (process.env.NODE_ENV !== "production") {
	process.env.GOOGLE_APPLICATION_CREDENTIALS = "./config/service_account.json"
}

const firestore = new Firestore({
	projectId: "obvescevalnik",
})
if (!firebase.apps.length) {
	firebase.initializeApp()
}

const validateFirebaseIdToken = async (req, res) => {
	if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
		return false
	}

	let idToken
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
		idToken = req.headers.authorization.split("Bearer ")[1]
	} else {
		return false
	}

	return firebase
		.auth()
		.verifyIdToken(idToken)
		.then((decodedIdToken) => {
			req.user = decodedIdToken
			req.token = idToken
			return true
		})
		.catch((err) => {
			console.error(err)
			return false
		})
}

export default async function handler(req, res) {
	var data = {}
	const isLoggedIn = await validateFirebaseIdToken(req, res)
	await firestore
		.collection("predlogi")
		.orderBy("timestamp", "desc")
		.limit(1000)
		.get()
		.then((response) => {
			let documents = []
			response.forEach((document) => documents.push(document.data()))
			return Promise.all(documents)
		})
		.then((response) => {
			return Promise.all(
				response.map((predlog) => {
					return firestore
						.collection("users")
						.doc(predlog.avtor)
						.get()
						.then((r) => {
							predlog.avtor = r.data()
							return predlog
						})
						.then((response) => {
							if (isLoggedIn) {
								return firestore
									.collection("predlogi")
									.doc(predlog.id)
									.collection("vsecki")
									.doc(req.user.uid)
									.get()
									.then((r) => {
										if (r.data()) {
											response.jeVseckan = true
										}
										return response
									})
							} else {
								return response
							}
						})
						.then((response) => {
							if (isLoggedIn) {
								return firestore
									.collection("predlogi")
									.doc(predlog.id)
									.collection("nevsecki")
									.doc(req.user.uid)
									.get()
									.then((r) => {
										if (r.data()) {
											response.jeNevseckan = true
										}
										return response
									})
							} else {
								return response
							}
						})
				})
			)
		})
		.then((response) => {
			data.success = true
			data.data = response
				.filter((predlog) => predlog.avtor.obcina.name === req.query.obcina)
				.sort((a, b) => {
					const ocena = b.vsecki - b.nevsecki - (a.vsecki - a.nevsecki)
					if (ocena === 0) return b.timestamp - a.timestamp
					return ocena
				})
			console.log(JSON.stringify(data))
			res.status(200).send(JSON.stringify(data))
		})
		.catch((err) => {
			console.error(err)
			res.status(500).send({ error: "Internal server error" })
		})
}
