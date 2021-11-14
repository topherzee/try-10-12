// import logo from './logo.svg';
// import './App.css';

import CardTech from './CardTech.js';

import axios from "axios";
import React from "react";

const client = axios.create({
  baseURL: "http://localhost:8080/magnoliaAuthor/.rest/delivery/tech" 
});
//https://www.freecodecamp.org/news/how-to-use-axios-with-react/#how-to-use-the-async-await-syntax-with-axios

function App() {

  const [card, setCard] = React.useState(null);

  React.useEffect(() => {
    async function getCard() {
      const response = await client.get("/tech/Experience/Page%20template");
      setCard(response.data);
    }
    getCard();
  }, []);

  let renderBack = false

  const card1 = {
    "@name": "Personalization trait",
    "@path": "/tech/UI/Personalization trait",
    "@id": "a1aff2dd-b116-4eaa-b3ad-a685282adacc",
    "@nodeType": "card",
    "category": "UI",
    "name": "Personalization trait",
    "description": "Provide a custom trait, based on request headers, user behaviour, contextual factors, or external systems. Authors can then create variants of content to be shown based on the trait values.",
    "tags_text": "marketing, experience, interoperability",
    "image_url": "personalization-trait-ben-weber-788982-unsplash.jpg",
    "cost": "1/3",
    "@nodes": []
  }

  if (!card) return "No card!"

  return (
    <div className="App">
      <header className="App-header">
        
      <CardTech {...card} color="blue" key={card.title}  back={renderBack} />
      <CardTech {...card} color="blue" key={card.title}  back={renderBack} />
      </header>
    </div>
  );
}

export default App;
