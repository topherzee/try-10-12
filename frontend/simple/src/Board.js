// import logo from './logo.svg';
// import './App.css';

// import CardTechBoard from './components/CardTechBoard.js';
import CardMid from './components/CardMid.js';
import CardMini from './components/CardMini.js';
import CardTechRaw from './components/CardTechRaw.js';

import axios from "axios";
import React from "react";

import { Rnd } from "react-rnd";

import { useCallback } from 'react';

import updateIH from 'immutability-helper';

// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, off, child, update, onValue } from "firebase/database";
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

// var clientId=(Math.random()*10000000000000000).toFixed(0);

// const URL_DEV = "http://localhost:8080/magnoliaAuthor/.rest/delivery/tech";
// const URL_PROD = "https://author-td8tdv78a6qyzt6p.saas.magnolia-cloud.com/.rest/environments/cards/delivery/tech"
const URL=process.env.REACT_APP_MAG_REST;

const client = axios.create({
  baseURL: URL 
});
//https://www.freecodecamp.org/news/how-to-use-axios-with-react/#how-to-use-the-async-await-syntax-with-axios

function Board() {

  const [cards, setCards] = React.useState(null);
  const [boards, setBoards] = React.useState(null);
  const [board, setBoard] = React.useState({cards:[]});
  const [category, setCategory] = React.useState("All");
  const [newBoardName, setNewBoardName] = React.useState("");
  const [boardName, setBoardName] = React.useState("");
  const [cardPreview, setCardPreview] = React.useState(null);

  const randomCardAngle = () => {return Math.round(Math.random() * 6)-3};





  async function getBoards() {

    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `boards`))
    const response = snapshot.val()
  
    var boards1 = response;//response.data.results;

    for (const property in boards1) {
      console.log(`${property}: ${boards1[property]}`);
    }

    setBoards(boards1);

    console.log('getBoards() done')
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
    getBoards();

  }, []);


  React.useEffect(() => {
    if (boards){
      console.log(`useEffect.boards is updated:${Object.entries(boards).length}`)
    }else{
      console.log(`useEffect.boards null`)
    }
  },[boards])


  const onBoardChange = async(event) => {

    var boardNameSelected = event.target.value;
    
    console.log("onBoardChange= " + boardNameSelected)

    const fbpathOff = `boards/${boardName}`;

    off(ref(db, fbpathOff))

    // const dbRef = ref(db);
    // const snapshot = await get(child(dbRef, `boards/${boardNameSelected}`))
    // const response = snapshot.val()

    //var localBoard = response;
    // debugger;

    setBoardName(boardNameSelected)

    const fbpath = `boards/${boardNameSelected}`;
    onValue(ref(db, fbpath), (snapshot) => {
        const data = snapshot.val();
        console.log(`FBASE. BOARD onValue: ${JSON.stringify(data, null, 2)}`)

        setBoard(data)
      });
  };


  React.useEffect(() => {

    console.log(`board is updated:${board.cards.length}`)
    console.log(`board is updated:${JSON.stringify(board.cards,null, 2)}`)
    
  },[board])

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
  const addCardToBoard = (cardId, cardName,  e) => {
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
    const array = updateIH(board.cards, {$push: [newCardObj]})

    var localBoard = updateIH(board, {
      cards: {$set: array}
    });
    setBoard(localBoard)

    //Send to firebase
    const dbpath = `boards/${boardName}/cards/${board.cards.length}`;
    console.log(`Realtime push card: ${dbpath}`)
    set(ref(db, dbpath), newCardObj)
  }

  const setBoardCardPosition = (e, d) => {
    //e.preventDefault();
    //console.log('You clicked a card. ' + cardName + ' ' + cardId);
    console.log(`setBoardCardPosition to ${d.x} ${d.y}`)
    const cardkey = d.node.attributes.cardkey.value
    console.log(`cardkey ${cardkey}`)

    const index = board.cards.findIndex(card => 
      card.key === cardkey
    )

    const localBoard = updateIH(board, {cards: {[index]: {$merge: {x:d.x, y:d.y}}}})

    setBoard(localBoard)

    //Send to firebase
    const dbpath = `boards/${boardName}/cards/${index}`;
    console.log(`Realtime.Update position ${dbpath} x:${d.x}`)
    update(ref(db, dbpath), {
      "x":d.x,
      "y":d.y
    })

  }


const removeCardFromBoardByKey = useCallback((cardkey, cardName) => {
  console.log(`removeCardFromBoardByKey ${cardkey} ${cardName}`)

  const index = board.cards.findIndex(card => 
    card.key === cardkey
  )
  const localBoard = updateIH(board, {cards: {$splice: [[index,1]]}})
  setBoard(localBoard)

  //Send to firebase
  //Special care is needed because we want to keep it an array
  //https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
  const dbpath = `boards/${boardName}/cards`;
  console.log(`Realtime. Remove card ${dbpath} :${localBoard.cards}`)
  set(ref(db, dbpath), localBoard.cards)

}, [board, boardName]);


const handleNoteChange = useCallback((cardkey, cardName, e, newNoteParam) => {
  
  const newNote = e ? e.target.value : newNoteParam;
  console.log(`handleNoteChange key:${cardkey} name:'${cardName}' note:'${newNote}'`)

  const index = board.cards.findIndex(card => 
    card.key === cardkey
  )
  console.log(`handleNoteChange index:${index}`)
 
  if (index>-1){
    const localBoard = updateIH(board, {cards: {[index]: {$merge: {note:newNote}}}})

    setBoard(localBoard)
  
    //Send to firebase
    const dbpath = `boards/${boardName}/cards/${index}`;
    console.log(`Realtime.Update note ${dbpath} :${newNote}`)
    update(ref(db, dbpath), {
      "note":newNote,
    })
  }
  
}, [board, boardName]);

const showFullCard = useCallback((cardId) => {
  console.log(`ShowFullCard ${cardId} `)
  setCardPreview(cardId)
}, []);

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

  // const getBoardById = (boardId) => {
  //   const found = boards.find(board => 
  //     board['@id'] === boardId
  //   )
  //   return found;
  // }
//https://www.youtube.com/watch?v=X-iSQQgOd1A

const saveBoard = async(param, e) => {
  //e.preventDefault();
  console.log('Save Board. ' + newBoardName);
  //Disable saving to Magnolia for now. - Using Firebase instead..
  //putBoardToMagnolia(newBoardName, board, getBoards, true)

  var localBoard = updateIH(board, {
    name: {$set: newBoardName}
  });

  //Send to firebase
  const dbpath = `boards/${newBoardName}`;
  console.log(`FIRE add board: ${dbpath}`)
  await set(ref(db, dbpath), localBoard)

  const el = document.getElementById("board-name-input")
  el.value = ''

  getBoards()
}

const onNameChange = (event) => {
  setNewBoardName(event.target.value);
};


if (!cards) return "No card!"

  console.log("before miniCards")

  const miniCards = cards.map((card) =>
    {
    if (!(category==="All") && card.category !== category){
      return null;
    }

    var selected = false;
    //console.log("Board.cards:" + JSON.stringify(board.cards, null, 2))
    //debugger;
    if (board.cards?.includes(card['@id'])){
      selected = true;
    }
    return <CardMini key={card.name} {...card} color="blue" back={renderBack} selected={selected} toggleSelection={addCardToBoard} />
    }
  );


  const boardCards = board.cards?.map((cardObj, index) =>
  {
    const techCard = getCardById(cardObj.cardId);

    return <Rnd key={cardObj.key}  cardkey={cardObj.key} dragHandleClassName={'mini-card-category'} bounds='parent' enableResizing={{}}
      position={{ x: cardObj.x, y: cardObj.y }}
      // onDragStop={setBoardCardPosition}
      onDrag={setBoardCardPosition}
    >
      <CardMid {...techCard} boardName={board.name} cardkey={cardObj.key} note={cardObj.note} index={index} removeCard={removeCardFromBoardByKey} handleNoteChange={handleNoteChange} contentsClick={showFullCard}/>
    </Rnd>
    }
  );


  const BoardSelector = () => {

    if (!boards){
      return <h2>No boards loaded.</h2>;
    }

    //const boardsArray = ;
    // debugger;
    const options = Object.entries(boards).map(([key, board], index) =>{
      return (<option key={key} value={key} >{key}</option>)
      // return (<option key={board['@id']} value={board['@id']}>{key}</option>)
    })

    return (
      <select id="hand-select" className="hand-select" value={boardName} onChange={onBoardChange}>
        <option key="choose">Choose a board</option>
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
      
      <h1 className="app-title">Board</h1>
      
      <div id="hand" className="hand" >
        <div id="hand-cards" className="hand-cards" style={cardsStyle}>
          {cardPreview && <div className="hand-card-preview" onClick={clearCardPreview}><CardTechRaw {...getCardById(cardPreview)}></CardTechRaw></div>}

            {boardCards}
        </div>
        <div className="hand-info">
          <h1 className="hand-name">{board.name}</h1>
          <div className="hand-description">{board.description}</div>
        </div>
      </div>
    
      <div className="loadSave">
        <div style={{marginBottom: "4mm"}}>
          <div>
            <span className="filter-label">Load Board:</span>
            <BoardSelector/>
          </div>

          <div className="save-button" key="SaveButton" onClick={(e)=> saveBoard("some-text",e)}>Create Board</div>
          <input id="board-name-input" onChange={onNameChange} className="hand-name-input" type="text" placeholder="Name of board"/>
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
