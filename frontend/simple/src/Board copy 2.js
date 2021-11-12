// import logo from './logo.svg';
// import './App.css';

// import CardTechBoard from './components/CardTechBoard.js';
import CardMid from './components/CardMid.js';
import CardMini from './components/CardMini.js';
import CardTechRaw from './components/CardTechRaw.js';

import {putHandToMagnolia} from './LoadAndSave.js'

import axios from "axios";
import React from "react";
import { useStateWithCallbackLazy } from 'use-state-with-callback';


import { Rnd } from "react-rnd";
// import Draggable from 'react-draggable'; 

import { useCallback } from 'react';

import updateIH from 'immutability-helper';

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

var clientId=(Math.random()*10000000000000000).toFixed(0);

// const URL_DEV = "http://localhost:8080/magnoliaAuthor/.rest/delivery/tech";
// const URL_PROD = "https://author-td8tdv78a6qyzt6p.saas.magnolia-cloud.com/.rest/environments/cards/delivery/tech"
const URL=process.env.REACT_APP_MAG_REST;

const client = axios.create({
  baseURL: URL 
});
//https://www.freecodecamp.org/news/how-to-use-axios-with-react/#how-to-use-the-async-await-syntax-with-axios

function Board() {

  const [cards, setCards] = React.useState(null);
  const [hands, setHands] = React.useState(null);
  const [hand, setHand] = useStateWithCallbackLazy({cards:[]});
  const [category, setCategory] = React.useState("All");
  const [newHandName, setNewHandName] = React.useState("");
  const [cardPreview, setCardPreview] = React.useState(null);

  const randomCardAngle = () => {return Math.round(Math.random() * 6)-3};

  async function getHands() {
    const URL_HANDS_DELIVERY = "http://localhost:8080/magnoliaAuthor/.rest/delivery/boards";
    const url = URL_HANDS_DELIVERY + "?@ancestor=/Topher&orderBy=name"
    const response = await axios.get(url);
    console.log("getHands: " + url)

    var hands1 = response.data.results;
    
    hands1.forEach(hand =>{
      //debugger;
      var cardsDetails = null;
      try{
        cardsDetails = JSON.parse(hand.cardsDetails);
      }catch(e){
        console.log("no cardDetails.")
      }

      //need to handle deleted but unpublished items. :(
      if (!hand.cards){
        return null; //neds improvement!
      }

      const newCards = hand.cards.map((card, index) => {
        if (cardsDetails){
          const c = cardsDetails[index];
          return {
            cardId: card, 
            key: c.key,
            x: c.x,
            y: c.y,
            note: c.note,
            angle: randomCardAngle()
          }
        }else{
          const key = "K" + Math.floor(10000 + Math.random() * 90000)
          return {
            cardId: card, 
            key: key,
            x: (index * 100),
            y: 40,
            note: "",
            angle: randomCardAngle()
          }
        }
        
      })
      hand.cards = newCards;
    })

    //debugger;
    setHands(hands1);

    // //INITIALISE A HAND.
    // var localHand = getHandById(hands1[0]["@id"])
    // setHand(localHand)
  }

  React.useEffect(() => {
    async function getCards() {
      // const response = await client.get("?@ancestor=/tech/Experience");
      const response = await client.get("?@ancestor=/tech&orderBy=name");
      console.log("getCards")
      var c = response.data.results;
      c.sort((a,b) => {
        if (!a.category || !b.category){
          return 0
        }
        let ac = a.category.toUpperCase();
        let bc = b.category.toUpperCase();
        return ((ac < bc) ? 1 : ((bc < ac) ? -1 : 0))
      })

      setCards(response.data.results);
    }

    getCards();
    getHands();

    


          //INIT FOR TESTING
  // onHandChange(
  //   {
  //     target:{
  //       value: "11258bad-2443-4872-ad31-8e1cca471f1e"
  //     }
  //   }
  // )

 

  }, []);



  const onHandChange = (event) => {
    //setNewHandName(event.target.value);
    var handId = event.target.value;
    var localHand = getHandById(handId)
    console.log("onHandChange= " + handId)
    // setHand(null)
    setHand(localHand, (localHand) => {

  // debugger;
      //Send to Firebase..
      // const db = getDatabase();
      console.log(`Realtime.Update board ${localHand.name}`)
      set(ref(db, `boards/${localHand.name}`), {
        "cards":localHand.cards
      });

      // FIREBASE - react to card position and note changes
      localHand.cards.forEach((card, index) =>{
        const fbpath = `boards/${localHand.name}/cards/${index}`;
        const starCountRef = ref(db, fbpath);
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          console.log(`Realtime. note onValue: ${JSON.stringify(data, null, 2)}`)
          const techCard = getCardById(data.cardId);

          handleNoteChange(data.key, techCard.name,null,data.note)
        });
      })
    })

    
  };


  React.useEffect(() => {


    //CLZ ALERT nogt actually working yet!

    //load a starting hand - for testing:
    // if (hands){
    //   // var localHand = getHandById(hands[0]["@id"])
    //   // setHand(localHand)
    //     onHandChange(
    //       {
    //         target:{
    //           value: hands[0]["@id"]
    //         }
    //       }
    //     )
    //   // }
    //   if (document.getElementById("hand-select")){
    //     document.getElementById("hand-select").val=hands[0]["@id"]
    //   }
      
  // }
    
  },[hands])

  React.useEffect(() => {

    console.log(`hand is updated:${hand.cards.length}`)
    
  },[hand])

  let renderBack = false

  // const card1 = {
  //   "@name": "Personalization trait",
  //   "@path": "/tech/UI/Personalization trait",
  //   "@id": "a1aff2dd-b116-4eaa-b3ad-a685282adacc",
  //   "@nodeType": "card",
  //   "category": "UI",
  //   "name": "Personalization trait",
  //   "description": "Provide a custom trait, based on request headers, user behaviour, contextual factors, or external systems. Authors can then create variants of content to be shown based on the trait values.",
  //   "tags_text": "marketing, experience, interoperability",
  //   "image_url": "personalization-trait-ben-weber-788982-unsplash.jpg",
  //   "cost": "1/3",
  //   "@nodes": []
  // }

  //TODO
  const addCardToHand = (cardId, cardName,  e) => {
    //e.preventDefault();
    console.log('You clicked a card. ' + cardName + ' ' + cardId);
    
    const key = "K" + Math.floor(10000 + Math.random() * 90000)
    const newCardObj = {
      cardId: cardId, 
      key: key,
      x: 20,
      y: 20,
      note: "",
      angle: randomCardAngle()
    }
    const array = updateIH(hand.cards, {$push: [newCardObj]})

    var localHand = updateIH(hand, {
      cards: {$set: array}
    });
    setHand(localHand)
  }

  const setHandCardPosition = (e, d) => {
    //e.preventDefault();
    //console.log('You clicked a card. ' + cardName + ' ' + cardId);
    console.log(`setHandCardPosition to ${d.x} ${d.y}`)
    const cardkey = d.node.attributes.cardkey.value
    console.log(`cardkey ${cardkey}`)

    const index = hand.cards.findIndex(card => 
      card.key === cardkey
    )

    const localHand = updateIH(hand, {cards: {[index]: {$merge: {x:d.x, y:d.y}}}})

    setHand(localHand)

    //Send to firebase
    const dbpath = `boards/${localHand.name}/cards/${index}`;
    console.log(`Realtime.Update position ${dbpath} x:${d.x}`)
    update(ref(db, dbpath), {
      "x":d.x,
      "y":d.y
    })

  }

const removeCardFromHandByKey = useCallback((cardkey, cardName) => {
  console.log(`removeCardFromHandByKey ${cardkey} ${cardName}`)

  // const array = update(hand.cards, {$splice: [cardId]})
  const index = hand.cards.findIndex(card => 
    card.key === cardkey
  )
  //var index = hand.cards.indexOf(cardId);
  const localHand = updateIH(hand, {cards: {$splice: [[index,1]]}})

  // var localHand = update(hand, {
  //   cards: {$set: array}
  // });
  setHand(localHand)

}, [hand]);

const handleNoteChange = useCallback((cardkey, cardName, e, newNoteParam) => {
  
  const newNote = e ? e.target.value : newNoteParam;
  console.log(`handleNoteChange key:${cardkey} name:'${cardName}' note:'${newNote}'`)

  const index = hand.cards.findIndex(card => 
    card.key === cardkey
  )
  console.log(`handleNoteChange index:${index}`)
  // debugger;
  if (index>-1){
    const localHand = updateIH(hand, {cards: {[index]: {$merge: {note:newNote}}}})

    setHand(localHand)
  
    //Send to firebase
    const dbpath = `boards/${localHand.name}/cards/${index}`;
    console.log(`Realtime.Update note ${dbpath} :${newNote}`)
    update(ref(db, dbpath), {
      "note":newNote,
    })
  }
  


}, [hand]);

// const showFullCardOLD = (id, e) => {
//   //e.preventDefault();
//   console.log('ShowFullCard ' + id);
//   setCardPreview(id)
// }

const showFullCard = useCallback((cardId) => {
  console.log(`ShowFullCard ${cardId} `)
  setCardPreview(cardId)
}, []);


// const removeCard = (cardId) => {
//   //setNewHandName(event.target.value);o
//   console.log("remove: " + cardId)
//   toggleSelection(cardId, "")
// };


  // const addOrRemove =(arrayInput, value) => {
  //   //var array = deepClone(arrayInput)
  //   var array;
  //   var index = arrayInput.indexOf(value);
  //   if (index === -1) {
  //       //array.push(value);
  //       array = update(arrayInput, {$push: [value]})
  //   } else {
  //       //array.splice(index, 1);
  //       array = update(arrayInput, {$splice: [[index,1]]})
  //   }
  //   return array;
  // }




  const toggleCategory = (name, e) => {
    //e.preventDefault();
    console.log('You clicked a Category. ' + name);
    setCategory(name)
  }

  const getCardById = (cardId) => {
    const found = cards.find(card => 
      card['@id'] === cardId
    )
    return found;
  }

  const getHandById = (handId) => {
    const found = hands.find(hand => 
      hand['@id'] === handId
    )
    return found;
  }
//https://www.youtube.com/watch?v=X-iSQQgOd1A

const saveHand = (e) => {
  //e.preventDefault();
  console.log('Save Hand. ' + newHandName);
  putHandToMagnolia(newHandName, hand, getHands, true)
}

const onNameChange = (event) => {
  setNewHandName(event.target.value);
};


if (!cards) return "No card!"

  console.log("before miniCards")

  const miniCards = cards.map((card) =>
    {
    if (!(category==="All") && card.category !== category){
      return null;
    }

    var selected = false;
    //console.log(JSON.stringify(hand, null, 2))
    if (hand.cards?.includes(card['@id'])){
      selected = true;
    }
    return <CardMini key={card.name} {...card} color="blue" back={renderBack} selected={selected} toggleSelection={addCardToHand} />
    }
  );

  const handCards = hand.cards?.map((cardObj, index) =>
  {
    const techCard = getCardById(cardObj.cardId);

    // const left = index * 140;
    //console.log(cardObj.note)
    return <Rnd key={cardObj.key}  cardkey={cardObj.key} dragHandleClassName={'mini-card-category'} bounds='parent' enableResizing={{}}
      default={{
        x: cardObj.x,
        y: cardObj.y,
      }}
      onDragStop={setHandCardPosition}

    ><CardMid {...techCard} handName={hand.name} cardkey={cardObj.key} note={cardObj.note} index={index} removeCard={removeCardFromHandByKey} handleNoteChange={handleNoteChange} contentsClick={showFullCard}/>
    </Rnd>

    }
  );

  //INIT FOR TESTING
  // onHandChange(
  //   {
  //     target:{
  //       value: "11258bad-2443-4872-ad31-8e1cca471f1e"
  //     }
  //   }
  // )


  


  const HandSelector = () => {

    const options = hands.map((hand, index) =>{
      return (<option key={hand['@id']} value={hand['@id']}>{hand.name}</option>)
    })

    return (
      <select id="hand-select" className="hand-select" onChange={onHandChange}>
        <option>Choose a hand</option>
        {options}
        </select>
    )
  };

  var scale = 1.0;
  var cardsStyle = {
    transform:scale
  }
 

  // transform:scale(0.8)

  // const style = {
  //   // width: 300,
  // };

  const clearCardPreview = () => {
    setCardPreview(null)
  }

  return (

    <div className="App Board">
      
      <h1>Board</h1>
      
      <div id="hand" className="hand" >
        <div id="hand-cards" className="hand-cards" style={cardsStyle}>
          {cardPreview && <div className="hand-card-preview" onClick={clearCardPreview}><CardTechRaw {...getCardById(cardPreview)}></CardTechRaw></div>}

            {handCards}
        </div>
        <div className="hand-info">
          <h1 className="hand-name">{hand.name}</h1>
          <div className="hand-description">{hand.description}</div>
        </div>
      </div>
    
      <div className="loadSave">
        <div style={{marginBottom: "4mm"}}>
          <div>
            <span className="filter-label">Load Hand:</span>
            <HandSelector/>
          </div>

          <div className="save-button" key="SaveButton" onClick={(e)=> saveHand("some-text",e)}>Save Hand</div>
          <input id="hand-name-input" onChange={onNameChange} className="hand-name-input" type="text" placeholder="Name of hand"/>
        </div>
      </div>

      <div className="tools">
        <span className="filter-label">Tech Deck. Show:</span>
        <div className="category-filter" category="All" key="All" onClick={(e)=> toggleCategory("All",e)}>All</div>
        <div className="category-filter" category="UI" key="UI" onClick={(e)=> toggleCategory("UI",e)}>UI</div>
        <div className="category-filter" category="Integration" key="Integration" onClick={(e)=> toggleCategory("Integration",e)}>Integration</div>
        <div className="category-filter" category="Experience" key="Experience" onClick={(e)=> toggleCategory("Experience",e)}>Experience</div>
        <div className="category-filter" category="Backend" key="Backend" onClick={(e)=> toggleCategory("Backend",e)}>Backend</div>
        <br/>
        {miniCards}
      </div>
       

  </div>
  );
}

export default Board;
