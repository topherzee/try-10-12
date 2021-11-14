import React from 'react';

// import firebase from 'firebase';
import {useState} from 'react';
// import database from './firebase';

import { initializeApp } from 'firebase/app';
// import { getDatabase } from "firebase/database";

import { getDatabase, ref, set } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyAAz4Gnutgu_ifM6sHZMAoseJ6DSt2ZRuQ",
    authDomain: "magnolia-cards.firebaseapp.com",
    projectId: "magnolia-cards",
    storageBucket: "magnolia-cards.appspot.com",
    messagingSenderId: "595996533452",
    appId: "1:595996533452:web:26300d2b423ea64ac3d869",
    databaseURL: "https://magnolia-cards-default-rtdb.europe-west1.firebasedatabase.app",

  };
  // https://magnolia-cards-default-rtdb.europe-west1.firebasedatabase.app
  //https://magnolia-cards-default-rtdb.firebaseio.com/
    
  const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


  
// export default database;

  
function FBase() {
  const [name , setName] = useState();
  const [age , setAge] = useState();
      
  // Push Function
  const Push = () => {
  
    
    
    //   database.ref("user").set({
    //     name : name,
    //     age : age,
    //     }).catch(alert);

        const db = getDatabase();
        // set(ref(db, 'users'), {
        //     name : name,
        // age : age,
        // });

        // set(ref(db, 'boards'), {
        //   name : name,
        //   cards : [
        //     {
        //       id:10,
        //       type:'cool'
        //     },
        //     {
        //       id:11,
        //       type:'lame'
        //     },
        //   ],
        // });

        // set(ref(db, 'boards'), {
        //   name : name,
        //   cards2 : {
        //     "coolio": {
        //       id:10,
        //       type:'cool'
        //     },
        //     "jimmy":{
        //       id:11,
        //       type:'lame'
        //     },
        //   },
        // });

        set(ref(db, 'boards/cards2/jimmy'), {
          
              id:12,
              type:'lamelame'
         
        });


  }
  
  return (
    <div className="App" style={{marginTop : 250}}>
      <center>
      <input placeholder="Enter your name" value={name} 
      onChange={(e) => setName(e.target.value)}/>
      <br/><br/>
      <input placeholder="Enter your age" value={age} 
      onChange={(e) => setAge(e.target.value)}/>
      <br/><br/> 
      <button onClick={Push}>PUSH</button>
      </center>
    </div>
  );
}
  
export default FBase;