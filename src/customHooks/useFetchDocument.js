import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase/Config";


const useFetchDocument = (collectionName, documentId) => {
      const [document, setDocument] = useState(null);
      
      const getDocument = async () => {
		const docRef = doc(db, collectionName,documentId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document data:", docSnap.data());
			const obj = {
				id: documentId,
				...docSnap.data(),
			};
			setDocument(obj);
		} else {
			toast.error("Document not found");
		}
	};

	// eslint-disable-next-line
      useEffect(() => {
            getDocument()
      }, []);

      return {document};
};

export default useFetchDocument;
