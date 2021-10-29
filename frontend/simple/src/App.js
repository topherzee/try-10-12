// import logo from './logo.svg';
// import './App.css';

import CardTech from './components/CardTech.js';
import CardMini from './components/CardMini.js';

import axios from "axios";
import React from "react";

import { useCallback } from 'react';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import update from 'immutability-helper';

const URL_DEV = "http://localhost:8080/magnoliaAuthor/.rest/delivery/tech";
const URL_PROD = "https://author-td8tdv78a6qyzt6p.saas.magnolia-cloud.com/.rest/environments/cards/delivery/tech"

const client = axios.create({
  baseURL: URL_PROD 
});
//https://www.freecodecamp.org/news/how-to-use-axios-with-react/#how-to-use-the-async-await-syntax-with-axios

function App() {

  //const [card, setCard] = React.useState(null);
  const [cards, setCards] = React.useState(null);

  const [hand, setHand] = React.useState([]);
  const [category, setCategory] = React.useState("All");

  React.useEffect(() => {
    // async function getCard() {
    //   const response = await client.get("/tech/Experience/Page%20template");
    //   setCard(response.data);
    // }
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
    
    //getCard();
    getCards();

    //setHand(['Personalization trait', 'Alert', 'UI language'])

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



  const toggleSelection = (cardId, cardName,  e) => {
    //e.preventDefault();
    console.log('You clicked a card. ' + cardName + ' ' + cardId);
    var localHand = addOrRemove(hand, cardId)
    //setHand([name])
    console.log(localHand)
    setHand(localHand)
  }

  const toggleCategory = (name, e) => {
    //e.preventDefault();
    console.log('You clicked a Category. ' + name);
    setCategory(name)
  }

  const addOrRemove =(arrayInput, value) => {
    var array = deepClone(arrayInput)
    var index = array.indexOf(value);
    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
    return array;
  }

  function deepClone(array) {
    return JSON.parse(JSON.stringify(array));
  }


  // const getCardByName = (cardName) => {
  //   const found = cards.find(card => 
  //     card.name === cardName
  //   )
  //   return found;
  // }
  const getCardById = (cardId) => {
    const found = cards.find(card => 
      card['@id'] === cardId
    )
    return found;
  }
//https://www.youtube.com/watch?v=X-iSQQgOd1A



const moveCard = useCallback((dragIndex, hoverIndex) => {
  console.log(`moveCard ${dragIndex} ${hoverIndex}`)
  const dragCard = hand[dragIndex];
  setHand(update(hand, {
      $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
      ],
  }));
}, [hand]);

const addNodeProp = (pName, pValue) => {
  var p = {
    "name": pName,
    "type": "String",
    "multiple": false,
    "values": [
        pValue
    ]
  }
  return p;
}
const putHandToMagnolia = (handName, hand) =>{
  var h = {};

  h.name = handName;
  h.type = "hand";
  h.path = `Topher/${handName}`;
  h.nodes = null;

  h.properties = {}
  h.properties.push(addNodeProp("name", handName))
  h.properties.push(addNodeProp("description", "sample description"))
  var hObj = [
    {
        "name": "hand",
        "type": "String",
        "multiple": false,
        "values": hand
    }];

    h.properties.push(hObj)

    console.log("P "+ JSON.stringify(h,null,2))
    debugger;

  return h;
}

const saveHand = (name, e) => {
  //e.preventDefault();
  console.log('Save Hand. ' + name);
  putHandToMagnolia(name, hand)
  //TODO
}

  // const cardElements = cards.map((card) =>
  // <CardMini {...card} color="blue" key={card.title}  back={renderBack} />
// );
  //if (!card) return "No card!"
  if (!cards) return "No card!"


  console.log("before miniCards")

  const miniCards = cards.map((card) =>
    {
    if (!(category==="All") && card.category !== category){
      return null;
    }

    var selected = false;
    if (hand.includes(card['@id'])){
      selected = true;
    }
    return <CardMini {...card} color="blue" key={card.title}  back={renderBack} selected={selected} toggleSelection={toggleSelection} />
    }
  );

  const handCards = hand.map((cardId, index) =>
  {
    const card = getCardById(cardId);
    const a = Math.random() * 6;
    const angle = Math.round(a)-3;
    return <CardTech {...card} color="blue" key={card.name} angle={angle}  back={renderBack} index={index} moveCard={moveCard} />
    }
  );

  // const handCards = hand.map((cardName, index) =>
  // {
  //   const card = getCardByName(cardName);
  //   const a = Math.random() * 6;
  //   const angle = Math.round(a)-3;
  //   return <CardTech {...card} color="blue" key={card.name} angle={angle}  back={renderBack} index={index} moveCard={moveCard} />
  //   }
  // );

  const style = {
    // width: 300,
};

  return (
    <div className="App">
      <header className="App-header" style={style}>
        
      {/* <DndProvider backend={HTML5Backend}>
					<Container />
				</DndProvider> */}

      <DndProvider backend={HTML5Backend}>
        {handCards}
      </DndProvider>
    <br/>
    <div className="category-filter" category="All" key="All" onClick={(e)=> toggleCategory("All",e)}>All</div>
    <div className="category-filter" category="UI" key="UI" onClick={(e)=> toggleCategory("UI",e)}>UI</div>
    <div className="category-filter" category="Integration" key="Integration" onClick={(e)=> toggleCategory("Integration",e)}>Integration</div>
    <div className="category-filter" category="Experience" key="Experience" onClick={(e)=> toggleCategory("Experience",e)}>Experience</div>
    <div className="category-filter" category="Backend" key="Backend" onClick={(e)=> toggleCategory("Backend",e)}>Backend</div>

    <div className="save-button" key="SaveButton" onClick={(e)=> saveHand("some text",e)}>Save Hand</div>
      
      <br/>
      {miniCards}

      {/* <CardTech {...card} color="blue" key={card.title}  back={renderBack} />
      <CardTech {...card} color="blue" key={card.title}  back={renderBack} /> */}
      </header>
    </div>
  );
}

export default App;
