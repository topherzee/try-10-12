import React from 'react';

function CardMini(props){

  const colMap = {
    "UI":"blue",
    "Experience":"red",
    "Backend":"m-green",
    "Integration":"yellow"
  }

  return(

    
    <div key={props.name} onClick={(e)=> props.toggleSelection(props['@id'],props.name ,e)}  className={`mini-card ${props.selected ? "mini-card-selected" : ""}`} >
      
        <div className={" mini-card-category color-" + colMap[props.category] + " cat-" + props.category }>
          {props.category}
        </div>

        <h3 className="mini-card-title">{props.name}</h3>
    </div>
  )
}






export default CardMini;
