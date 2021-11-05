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

        <div class="mid-cardgame-card-contents">
          <h3 className="mini-card-title">{props.name}</h3>

          <div class="mid-image-wrapper">
              <img  onClick={(e)=> props.removeCard(props['@id'],props.name ,e)} class={(props.screenshot==='x')?"screenshot":""} src={"./images/" + props.image_url} alt=""/>
            </div>
          </div>
    </div>
  )
}

export default CardMid;
