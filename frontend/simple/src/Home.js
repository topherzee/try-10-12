import {
    Link
  } from "react-router-dom";

export default function Home(props){

    return(
        <div className="home">
        <h1>--Magnolia Cards--</h1>

        <section>
            Craft, communinicate, teach and learn about Magnolia projects with Cards. 

            <div className="home-card">
                <h2>Boards</h2>
                <p>Lay out as many cards as you want on a board.
                    Collaborate with others in realtime.
                </p>

                <Link to="/boards">Boards</Link>
            </div>

            <div  className="home-card">
                <h2>Hands</h2>
                <p>Put together and ordered hand of cards that implements a certain use-case.
                </p>
                <Link to="/hands">Hands</Link>
            </div>
        </section>

        </div>
    )
}