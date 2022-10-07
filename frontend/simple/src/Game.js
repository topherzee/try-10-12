// import logo from './logo.svg';
// import './App.css';

import CardTechRaw from './components/CardTechRaw.js';

import axios from "axios";
import React from "react";


// const URL_DEV = "http://localhost:8080/magnoliaAuthor/.rest/delivery/tech";
// const URL_PROD = "https://author-td8tdv78a6qyzt6p.saas.magnolia-cloud.com/.rest/environments/cards/delivery/tech"
const URL=process.env.REACT_APP_MAG_REST;

const client = axios.create({
  baseURL: URL 
});


function Game() {

  const [cards, setCards] = React.useState(null);
  const [hand, setHand] = React.useState({cards:[]});
  
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
      setHand(cards[1])
    }

    getCards();
    // getHands();

  }, []);

  const handCards = () =>
  {

    return <CardTechRaw   />
    
  };

  return (

    <div className="App">
     HELLO
    
     {handCards}
     
    </div>
  );
  // <CardTechRaw {...cards[0]} />
}

export default Game;
