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

// const URL_DEV = "http://localhost:8080/magnoliaAuthor/.rest/delivery/tech";
// const URL_PROD = "https://author-td8tdv78a6qyzt6p.saas.magnolia-cloud.com/.rest/environments/cards/delivery/tech"
const URL=process.env.REACT_APP_MAG_REST;

const client = axios.create({
  baseURL: URL 
});
//https://www.freecodecamp.org/news/how-to-use-axios-with-react/#how-to-use-the-async-await-syntax-with-axios

function App() {

  //const [card, setCard] = React.useState(null);
  const [cards, setCards] = React.useState(null);
  const [hands, setHands] = React.useState(null);

  const [hand, setHand] = React.useState({cards:[]});
  const [category, setCategory] = React.useState("All");
  const [newHandName, setNewHandName] = React.useState("");

  async function getHands() {
    const URL_HANDS_DELIVERY = "http://localhost:8080/magnoliaAuthor/.rest/delivery/hands";

    // const response = await client.get("?@ancestor=/tech/Experience");
    const response = await axios.get(URL_HANDS_DELIVERY + "?@ancestor=/Topher&orderBy=name");
    console.log("getHands")

    setHands(response.data.results);
  }
  

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
    getHands();

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
    //var localHand = deepClone(hand)


    var localHand = update(hand, {
      cards: {$set: addOrRemove(hand.cards, cardId)}
    });


    //localHand.cards = 
    
    //console.log(JSON.stringify(localHand, null, 2))

    setHand(localHand)
  }

  const toggleCategory = (name, e) => {
    //e.preventDefault();
    console.log('You clicked a Category. ' + name);
    setCategory(name)
  }

  const addOrRemove =(arrayInput, value) => {
    //var array = deepClone(arrayInput)
    var array;
    var index = arrayInput.indexOf(value);
    if (index === -1) {
        //array.push(value);
        array = update(arrayInput, {$push: [value]})
    } else {
        //array.splice(index, 1);
        array = update(arrayInput, {$splice: [[index,1]]})
    }
    return array;
  }

  // function deepClone(object) {
  //   return JSON.parse(JSON.stringify(object));
  // }


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

  const getHandById = (handId) => {
    const found = hands.find(hand => 
      hand['@id'] === handId
    )
    return found;
  }
//https://www.youtube.com/watch?v=X-iSQQgOd1A



const moveCard = useCallback((dragIndex, hoverIndex) => {
  console.log(`moveCard ${dragIndex} ${hoverIndex}`)
  const dragCard = hand.cards[dragIndex];
  setHand(update(hand, { cards: {
      $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
      ],
  }}));
}, [hand]);

const removeCard = useCallback((id, name) => {
  console.log(`removeCard ${id} ${name}`)
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



const putHandToMagnolia = async (newHandName, hand) =>{
  var h = {};

  h.name = newHandName;
  h.type = "hand";
  h.path = `/Topher/${newHandName}`;
  h.nodes = null;

  h.properties = []
  h.properties.push(addNodeProp("name", newHandName))
  h.properties.push(addNodeProp("description", "sample description"))
  var hObj = 
    {
        "name": "cards",
        "type": "String",
        "multiple": true,
        "values": hand.cards
    };

    h.properties.push(hObj)
    console.log("Body... "+ JSON.stringify(h,null,2))
    
    try {

      const URL_NODES = process.env.REACT_APP_MAG_REST_NODES;
      const destination = URL_NODES + '/hands/Topher';  
      console.log("destination: " + destination);
      const response = await axios.put(destination, h, 
          {
              auth: {
                  username: 'superuser',
                  password: 'superuser'
              },
              headers: {'Content-Type': 'application/json'},
          }
      )
      console.log(response);

      // console.log(response.data.url);
      // console.log('-');
      // console.log(response.data.explanation);
      getHands();
    } catch (error) {
      console.log(error.response.body);
    } finally {
        console.log("tried to put")
    }
  console.log("method end")


    // const response = await client.get("?@ancestor=/tech&orderBy=name");
    //   console.log("getCards")
    //   var c = response.data.results;

  return h;
}

const saveHand = (e) => {
  //e.preventDefault();
  console.log('Save Hand. ' + newHandName);
  putHandToMagnolia(newHandName, hand)
  //TODO
}

const onNameChange = (event) => {
  setNewHandName(event.target.value);
};

// const removeCard = (cardId) => {
//   //setNewHandName(event.target.value);o
//   console.log("remove: " + cardId)
//   toggleSelection(cardId, "")

// };



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
    //console.log(JSON.stringify(hand, null, 2))
    if (hand.cards?.includes(card['@id'])){
      selected = true;
    }
    return <CardMini key={card.name} {...card} color="blue" back={renderBack} selected={selected} toggleSelection={toggleSelection} />
    }
  );

  const handCards = hand.cards?.map((cardId, index) =>
  {
    const card = getCardById(cardId);
    const a = Math.random() * 6;
    const angle = Math.round(a)-3;
    return <CardTech {...card} color="blue" key={card.name} angle={angle}  back={renderBack} index={index} moveCard={moveCard} removeCard={removeCard}/>
    }
  );

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

  
  const onHandChange = (event) => {
    //setNewHandName(event.target.value);
    var handId = event.target.value;
    var localHand = getHandById(handId)
    console.log("onHandChange= " + handId)
    setHand(localHand)
  };

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

        <div className="hand-cards">
        <DndProvider backend={HTML5Backend}>
          {handCards}
        </DndProvider>
        </div>

        <h1 className="hand-name">{hand.name}</h1>
        <div className="hand-description">{hand.description}</div>

        <div>
          <div className="save-button" key="SaveButton" onClick={(e)=> saveHand("some-text",e)}>Save Hand</div>
          <input id="hand-name-input" onChange={onNameChange} className="hand-name-input" type="text" placeholder="Name of hand"/>
          
          <span className="filter-label">Load Hand:</span>
          <HandSelector/>
        </div>

        <span className="filter-label">Show:</span>
        <div className="category-filter" category="All" key="All" onClick={(e)=> toggleCategory("All",e)}>All</div>
        <div className="category-filter" category="UI" key="UI" onClick={(e)=> toggleCategory("UI",e)}>UI</div>
        <div className="category-filter" category="Integration" key="Integration" onClick={(e)=> toggleCategory("Integration",e)}>Integration</div>
        <div className="category-filter" category="Experience" key="Experience" onClick={(e)=> toggleCategory("Experience",e)}>Experience</div>
        <div className="category-filter" category="Backend" key="Backend" onClick={(e)=> toggleCategory("Backend",e)}>Backend</div>


        <br/>
        {miniCards}

        {/* <CardTech {...card} color="blue" key={card.title}  back={renderBack} />
        <CardTech {...card} color="blue" key={card.title}  back={renderBack} /> */}
        </header>
      </div>
  );
}

export default App;
