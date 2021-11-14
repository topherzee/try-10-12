import React from 'react';

function CardMid(props){

  const style = {
    // border: '1px dashed gray',
    // padding: '0.5rem 1rem',
    // marginBottom: '.5rem',
    
    cursor: 'move',
  };

  const colMap = {
    "UI":"blue",
    "Experience":"red",
    "Backend":"m-green",
    "Integration":"yellow"
  }

  // const fbpath = `boards/${props.handName}/cards/${props.index}/note`;
  // const starCountRef = ref(db, fbpath);
  // onValue(starCountRef, (snapshot) => {
  //   const data = snapshot.val();
  //   //updateStarCount(postElement, data);
  //   console.log(`Realtime. onValue ${JSON.stringify(data, null, 2)}`)
  // });

  return(
   
    <div key={props.name} className={`mid-card`} >
      
        <div className={" mini-card-category color-" + colMap[props.category] + " cat-" + props.category } style={{ ...style}}>
          {props.category}
        </div>
        <div className="mid-close-button" title="Remove card" onClick={(e)=> props.removeCard(props.cardkey,props.name ,e)}>X</div>

        <div className="mid-cardgame-card-contents" onClick={(e)=> props.contentsClick(props["@id"] ,e)}>
          <h3 className="mini-card-title">{props.name}</h3>

          <div className="mid-image-wrapper">
            <img className={(props.screenshot==='x')?"screenshot":""} src={"./images/" + props.image_url} alt=""/>
          </div>
        </div>
        <input className="mid-note" type="text" value={props.note} onChange={(e)=> props.handleNoteChange(props.cardkey,props.name ,e)}></input>
    </div>
  )
}

export default CardMid;
