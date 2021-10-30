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

export const putHandToMagnolia = async (newHandName, hand, getHands) =>{
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