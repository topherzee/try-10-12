import React from 'react';

// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set,update, onValue } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAAz4Gnutgu_ifM6sHZMAoseJ6DSt2ZRuQ",
  authDomain: "magnolia-cards.firebaseapp.com",
  projectId: "magnolia-cards",
  storageBucket: "magnolia-cards.appspot.com",
  messagingSenderId: "595996533452",
  appId: "1:595996533452:web:26300d2b423ea64ac3d869",
  databaseURL: "https://magnolia-cards-default-rtdb.europe-west1.firebasedatabase.app",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


function CardMid(props){

  const colMap = {
    "UI":"blue",
    "Experience":"red",
    "Backend":"m-green",
    "Integration":"yellow"
  }

  // const fbpath = `boards/${props.handName}/cards/${props.index}/note`;
  // const starCountRef = ref(db, fbpath);
  // onValue(starCountRef, (snapshot) => {
  //   const data = snapshot.val();
  //   //updateStarCount(postElement, data);
  //   console.log(`Realtime. onValue ${JSON.stringify(data, null, 2)}`)
  // });

  return(
   
    <div key={props.name} className={`mid-card`} >
      
        <div className={" mini-card-category color-" + colMap[props.category] + " cat-" + props.category }>
          {props.category}
        </div>
        <div className="mid-close-button" title="Remove card" onClick={(e)=> props.removeCard(props.cardkey,props.name ,e)}>X</div>

        <div className="mid-cardgame-card-contents" onClick={(e)=> props.contentsClick(props["@id"] ,e)}>
          <h3 className="mini-card-title">{props.name}</h3>

          <div className="mid-image-wrapper">
            <img className={(props.screenshot==='x')?"screenshot":""} src={"./images/" + props.image_url} alt=""/>
          </div>
        </div>
        <input className="mid-note" type="text" value={props.note} onChange={(e)=> props.handleNoteChange(props.cardkey,props.name ,e)}></input>
    </div>
  )
}

export default CardMid;
