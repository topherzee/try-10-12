import axios from "axios";

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

  export const putBoardToMagnolia = async (newHandName, hand, getHands, isBoard) =>{
    putHandToMagnolia(newHandName, hand, getHands, isBoard)
  }


export const putHandToMagnolia = async (newHandName, hand, getHands, isBoard) =>{
    var h = {};
  
    h.name = newHandName;
    h.type = isBoard ? "board" : "hand";
    h.path = `/Topher/${newHandName}`;
    h.nodes = null;
  
    //hand.
    h.properties = []
    h.properties.push(addNodeProp("name", newHandName))
    h.properties.push(addNodeProp("description", "sample description"))

    //Check if cards are arrays.
    if (Array.isArray(hand.cards[0])){
      console.log("Need to strip off the keys before saving. Should be easy.")
      return false
    }

    //Deal with cards **********
    var hCardsObj;
    
    if (isBoard){

      const cardsArray = hand.cards.map(card =>{
        return card.cardId
      })
      hCardsObj = {
          "name": "cards",
          "type": "String",
          "multiple": true,
          "values": cardsArray
      };
      h.properties.push(hCardsObj)

      var cardsDetails = JSON.stringify(hand.cards,null, 2);
      //cardsDetails = "TEST"
      h.properties.push(addNodeProp("cardsDetails", cardsDetails))


    }else{

      //simple
      hCardsObj = {
          "name": "cards",
          "type": "String",
          "multiple": true,
          "values": hand.cards
      };
      h.properties.push(hCardsObj)
    }
    
      console.log("Body... "+ JSON.stringify(h,null,2))
      
      // debugger;




      try {
  
        const URL_NODES = process.env.REACT_APP_MAG_REST_NODES;
        const destination = isBoard ? (URL_NODES + '/boards/Topher'): (URL_NODES +  '/hands/Topher');  
        console.log("destination: " + destination);
        //debugger;
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