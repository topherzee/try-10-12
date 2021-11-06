import React from 'react';

function CardMid(props){

  const colMap = {
    "UI":"blue",
    "Experience":"red",
    "Backend":"m-green",
    "Integration":"yellow"
  }

  const test = (id, category, e) =>{
    console.log("yep: " + id)
  }

  return(

    
    <div key={props.name} className={`mid-card`} >
      
        <div className={" mini-card-category color-" + colMap[props.category] + " cat-" + props.category }>
          {props.category}
        </div>
        <div className="mid-close-button" title="Remove card" onClick={(e)=> props.removeCard(props.cardKey,props.name ,e)}>X</div>

        <div class="mid-cardgame-card-contents" onClick={(e)=> props.contentsClick(props["@id"] ,e)}>
          <h3 className="mini-card-title">{props.name}</h3>

          <div class="mid-image-wrapper">
            <img   class={(props.screenshot==='x')?"screenshot":""} src={"./images/" + props.image_url} alt=""/>
          </div>
        </div>
        <input class="mid-note" type="text"></input>
    </div>
  )
}

export default CardMid;
