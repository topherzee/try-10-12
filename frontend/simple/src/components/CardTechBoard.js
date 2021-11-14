import React from 'react';

import { useRef } from 'react';
import { ItemTypes } from '../ItemTypes';

const style = {
  // border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  // marginBottom: '.5rem',
  
  cursor: 'move',
};

function CardTechBoard(props){

  var index = props.index;
  var id = props.id;

  const ref = useRef(null);

  let costDisplay

  if (props.cost ==="1") {
    costDisplay = <Coin1 />;
  } else if (props.cost ==="3") {
    costDisplay = <Coin3 />;
  }else if (props.cost ==="1/3") {
    costDisplay = <Coin13 />;
  }else {
    costDisplay = "";
  }


  const colMap = {
    "UI":"blue",
    "Experience":"red",
    "Backend":"m-green",
    "Integration":"yellow"
  }

  // var tags=""
  // if (props.tags){
  //   tags = props.tags.replace(/,/g,'<br/>')
  // }



const opacity = 1;



  if (props.back){
    return(
      <div class="cardgame-card-print-wrapper tech-card-back" >
        <div class="rfp-card-center-point "></div>
        <div class="cardgame-card rfp-card ">
          <div class="cardgame-card-print-bounds ">
            <img class="back-tech-deck-logo" src="./tech-deck-logo-white.png" alt=""/>
          </div>
        </div>
      </div>
    )
  }else{

    // console.log("angle:" + props.angle)
    
    var a = -0;
    // // var a = props.angle
    // const rot = `rotate(${a}deg)`
    // var style = {
    //   transform:rot
    // }

    // style={{transform:rotate('2deg')}

  return(

    <div class="resizer " key={props.id} ref={ref} style={{ ...style, opacity }} >
      
      <div class="cardgame-card tech-card" >
      {/* <div className="card-remove" onclick={props.removeCard(props["@id"], props.name, null)}>REMOVE</div> */}
       
        <div class="cardgame-card-print-bounds ">
          <div class="card-footer">
          </div>
        </div>

        <div class={"cardgame-category color-" + colMap[props.category] + " cat-" + props.category }>
          <div class="cardgame-category-text">
          {props.category}
          </div>
        </div>

        <div class="cardgame-card-contents">
          <div class="textual">
            <h2 class="tech-deck-title">{props.name}</h2>
            {costDisplay}
            <p class="description">{props.description}</p>
          </div>

          <div class="image-wrapper">
            <img class={(props.screenshot==='x')?"screenshot":""} src={"./images/" + props.image_url} alt=""/>
          </div>
        </div>

      </div>
       
    </div>
  )
}
}



function Coin1(props){
  return(
    <div class="cost">
      <div class="cost-coins">
        <Coin/>
      </div>
    </div>
  )
}

function Coin3(props){
  return(
    <div class="cost">
      <div class="cost-coins">
        <Coin/><Coin/><Coin/>
      </div>
    </div>
  )
}

function Coin13(props){
  return (
    <div class="cost">

      <div class="cost-label">
        Stock:
      </div>
      <div class="cost-coins">
        <Coin/>
      </div>

      <div class="cost-label">
        Custom:
      </div>
      <div class="cost-coins">
        <Coin/><Coin/><Coin/>
      </div>
    </div>
  )
}





function Coin(props){
  return(
    <svg height="10" width="10">
      <circle cx="4" cy="4" r="4" strokeWidth="0" fill="#ffb300" />
    </svg>
  )
}


export default CardTechBoard;
