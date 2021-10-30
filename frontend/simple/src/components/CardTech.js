import React from 'react';

import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './../ItemTypes';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

function CardTech(props){

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



  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
        return {
            handlerId: monitor.getHandlerId(),
        };
    },
    hover(item, monitor) {
        if (!ref.current) {
            return;
        }
        const dragIndex = item.index;
        const hoverIndex = props.index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientX = clientOffset.x - hoverBoundingRect.left;
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        //console.log(`drag ${dragIndex} ${hoverIndex}`)
        //console.log(`drag ${hoverMiddleX} ${hoverClientX}`)

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
            return;
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
            return;
        }
        // Time to actually perform the action
        props.moveCard(dragIndex, hoverIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
    },
});
const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
        return { id, index };
    },
    collect: (monitor) => ({
        isDragging: monitor.isDragging(),
    }),
});
const opacity = isDragging ? 0 : 1;
drag(drop(ref));














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
    // const rot = `rotate(${props.angle}deg)`
    // var css = {
    //   transform:rot
    // }

    //style={{transform:rotate('2deg')}

  return(

    // <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
		// 	{props.name}
		// </div>

    <div class="cardgame-card-print-wrapper tech-card" key={props.id} ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      
      <div class="cardgame-card tech-card">
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

        <div class={"cardgame-category-bleed color-" + colMap[props.category] + " cat-" + props.category }>
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


export default CardTech;
