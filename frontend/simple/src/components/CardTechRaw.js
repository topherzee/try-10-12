import React from 'react';

import { useRef } from 'react';

const style = {
  // border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  // marginBottom: '.5rem',
  
  // cursor: 'move',
};

function CardTechRaw(props){

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
      <div className="cardgame-card-print-wrapper tech-card-back" >
        <div className="rfp-card-center-point "></div>
        <div className="cardgame-card rfp-card ">
          <div className="cardgame-card-print-bounds ">
            <img className="back-tech-deck-logo" src="./tech-deck-logo-white.png" alt=""/>
          </div>
        </div>
      </div>
    )
  }else{

    // console.log("angle:" + props.angle)
    
    // var a = -0;
    // // var a = props.angle
    // const rot = `rotate(${a}deg)`
    // var style = {
    //   transform:rot
    // }

    // style={{transform:rotate('2deg')}

  return(

 
    // <div className="cardgame-card-print-wrapper tech-card" key={props.id} ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      
      <div className="cardgame-card tech-card tech-card-raw" key={props.id} ref={ref} style={{ ...style, opacity }} >
      {/* <div className="card-remove" onclick={props.removeCard(props["@id"], props.name, null)}>REMOVE</div> */}
       
        <div className="cardgame-card-print-bounds ">
          <div className="card-footer">
          </div>
        </div>

        <div className={"cardgame-category color-" + colMap[props.category] + " cat-" + props.category }>
          <div className="cardgame-category-text">
          {props.category}
          </div>
        </div>

        <div className="cardgame-card-contents">
          <div className="textual">
            <h2 className="tech-deck-title">{props.name}</h2>
            {costDisplay}
            <p className="description">{props.description}</p>
          </div>

          <div className="image-wrapper">
            <img className={(props.screenshot==='x')?"screenshot":""} src={"./images/" + props.image_url} alt=""/>
          </div>
        </div>

      </div>
       
    // </div>
  )
}
}



function Coin1(props){
  return(
    <div className="cost">
      <div className="cost-coins">
        <Coin/>
      </div>
    </div>
  )
}

function Coin3(props){
  return(
    <div className="cost">
      <div className="cost-coins">
        <Coin/><Coin/><Coin/>
      </div>
    </div>
  )
}

function Coin13(props){
  return (
    <div className="cost">

      <div className="cost-label">
        Stock:
      </div>
      <div className="cost-coins">
        <Coin/>
      </div>

      <div className="cost-label">
        Custom:
      </div>
      <div className="cost-coins">
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


export default CardTechRaw;
