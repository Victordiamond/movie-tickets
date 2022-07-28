import React from 'react'
import { useState } from "react";


export const Tickets = ( props ) => {

  const [ammount, setAmmount] = useState('');
 



    return (
      <div className="row pt-4">
        {props.tickets.map((ticket) => (
          <div className="col-4">
            <div className="card" key={ticket.index}>
              <img
                className="card-img-top"
                src={ticket.image}
                alt="Card image cap"
              />
              <div className="card-body">
                <h2 className="card-title">Movie name: {ticket.name}</h2>
                <h5 className="card-title">Film Industry: {ticket.filmIndustry}</h5>
                <h5 className="card-title">Movie genre: {ticket.genre}</h5>
                <h5 className="card-title">{ticket.sold} Tickets Sold</h5>
                <h5 className="card-title">{ticket.ticketsAvailable} Tickets Available</h5>
                <h3>Price per ticket: {ticket.price / 1000000000000000000} cUSD</h3>
                <p className="card-text">{ticket.description}</p>

                <p className="card-texxt">{ticket.forSale ? "This Ticket is Available For Sale": "Not for sale"}</p>
              
                  {props.walletAddress !== ticket.Admin && ticket.forSale === true && ticket.ticketsAvailable !== 0 && (
                  <button
                    onClick={() => props.buyTicket(ticket.index)}
                    className = "btn btn-outline-primary"
                  >
                    Buy Ticket
                  </button>)
                  }

                  
                { props.walletAddress === ticket.Admin &&(
                  <form>
                  <div class="form-r">
                      <input type="text" class="form-control mt-4" value={ammount}
                           onChange={(e) => setAmmount(e.target.value)} placeholder="enter ammount"/>
                      <button type="button" onClick={()=>props.addmoreTickets(ticket.index, ammount)} class="btn btn-outline-info mt-2">add more tickets</button>
                      
                  </div>
                </form>
                
                       )}

                    

                       {
                         props.walletAddress === ticket.Admin &&(
                          <button
                          type="submit"
                          onClick={() => props.changeForsale(ticket.index)}
                          className="btn btn-outline-success pt-1"
                        >{ticket.forSale ? "Toggle not for sale" : "Toggle Forsale"}
                          
                        </button>
                         )
                       }
              </div>
            </div>
          </div>
      
        ))}
        
      </div>
    );
  };
  export default Tickets;