// import logo from './logo.svg';
// import './App.css';

// import CardTechBoard from './components/CardTechBoard.js';
import CardMid from './components/CardMid.js';
import CardMini from './components/CardMini.js';
import CardTechRaw from './components/CardTechRaw.js';

import {putHandToMagnolia} from './LoadAndSave.js'

import axios from "axios";
import React from "react";
import { Rnd } from "react-rnd";
// import Draggable from 'react-draggable'; 

import { useCallback } from 'react';

import update from 'immutability-helper';

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
  const [hand, setHand] = React.useState({cards:[]});
  const [category, setCategory] = React.useState("All");
  const [newHandName, setNewHandName] = React.useState("");
  const [cardPreview, setCardPreview] = React.useState(null);

  async function getHands() {
    const URL_HANDS_DELIVERY = "http://localhost:8080/magnoliaAuthor/.rest/delivery/hands";
    const response = await axios.get(URL_HANDS_DELIVERY + "?@ancestor=/Topher&orderBy=name");
    console.log("getHands")

    var hands1 = response.data.results;
    

    // TODO - add keys to all cards. cardIdAndKey
    hands1.forEach(hand =>{
      
      const newCards = hand.cards.map(card => {
        const key = Math.floor(10000 + Math.random() * 90000)
        return [card, key]
      })
      hand.cards = newCards;
    })
    
    setHands(hands1);
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

    //load a starting hand - for testing:
    // var localHand = getHandById(hands[0]["@id"])
    // setHand(localHand)

  }, []);

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
    
    const key = Math.floor(10000 + Math.random() * 90000)
    const array = update(hand.cards, {$push: [[cardId, key]]})


    var localHand = update(hand, {
      cards: {$set: array}
    });
    setHand(localHand)
  }


const removeCardFromHandByKey = useCallback((cardKey, cardName) => {
  console.log(`removeCardFromHandByKey ${cardKey} ${cardName}`)

  // const array = update(hand.cards, {$splice: [cardId]})
  const index = hand.cards.findIndex(card => 
    card[1] === cardKey
  )
  //var index = hand.cards.indexOf(cardId);
  const array = update(hand.cards, {$splice: [[index,1]]})

  var localHand = update(hand, {
    cards: {$set: array}
  });
  setHand(localHand)

}, [hand]);

// const showFullCardOLD = (id, e) => {
//   //e.preventDefault();
//   console.log('ShowFullCard ' + id);
//   setCardPreview(id)
// }

const showFullCard = useCallback((cardId) => {
  console.log(`ShowFullCard ${cardId} `)
  setCardPreview(cardId)
}, [cardPreview]);


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

// const moveCard = useCallback((dragIndex, hoverIndex) => {
//   console.log(`moveCard ${dragIndex} ${hoverIndex}`)
//   const dragCard = hand.cards[dragIndex];
//   setHand(update(hand, { cards: {
//       $splice: [
//           [dragIndex, 1],
//           [hoverIndex, 0, dragCard],
//       ],
//   }}));
// }, [hand]);


const saveHand = (e) => {
  //e.preventDefault();
  console.log('Save Hand. ' + newHandName);
  putHandToMagnolia(newHandName, hand, getHands)
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

  const handCards = hand.cards?.map((cardIdAndKey, index) =>
  {
    const card = getCardById(cardIdAndKey[0]);
    const a = Math.random() * 6;
    const angle = Math.round(a)-3;
    const left = index * 140;

    return <Rnd key={cardIdAndKey[1]} dragHandleClassName={'mini-card-category'} bounds='parent' enableResizing={{}}
      default={{
        x: left,
        y: 20,
      }
    }><CardMid {...card} cardKey={cardIdAndKey[1]} index={index} removeCard={removeCardFromHandByKey} contentsClick={showFullCard}/></Rnd>
    // return <CardMid {...card} key={card.name} index={index} />

    
    }
  );

  const onHandChange = (event) => {
    //setNewHandName(event.target.value);
    var handId = event.target.value;
    var localHand = getHandById(handId)
    console.log("onHandChange= " + handId)
    setHand(localHand)
  };

  const HandSelector = () => {

    const options = hands.map((hand, index) =>{
      return (<option key={hand['@id']} value={hand['@id']}>{hand.name}</option>)
    })

    return (
      <select className="hand-select" onChange={onHandChange}>
        <option>Choose a hand</option>
        {options}
        </select>
    )
  };

  var scale = 1.0;
  var cardsStyle = {
    transform:scale
  }
  // This is sort of working.. but it should update all thhe time.
  // Now it is one step too slow as it calculates it BEFORE the elements are rendered and updated!


  // if (document.getElementById("hand-cards")){
  //   const containerWidth = document.getElementById("hand")?.offsetWidth;
  //   console.log("conteriner w: " + containerWidth);
    
  //   const cardsWidth = document.getElementById("hand-cards")?.scrollWidth;
  //   console.log("cards w: " + cardsWidth);
    
  //   scale = `scale(${containerWidth/cardsWidth})`
    
  //   cardsStyle = {
  //     transform:scale
  //   }
  // }
 

  // transform:scale(0.8)

  const style = {
    // width: 300,
  };

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
