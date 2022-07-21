import React from 'react';
import { useState } from "react";

export const AddTicket = (props) => {

const [name, setName] = useState('');
const [image, setImage] = useState('');
const [filmIndustry, setFilmIndustry] = useState('');
const [genre, setGenre] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [ticketsAvailable, setTicketsAvailable] = useState('');



  return <div>


  
      <form>
  <div class="form-row">
    
      <input type="text" class="form-control" value={name}
           onChange={(e) => setName(e.target.value)} placeholder="name"/>

<input type="text" class="form-control mt-2" value={image}
           onChange={(e) => setImage(e.target.value)} placeholder="image"/>

<input type="text" class="form-control mt-2" value={filmIndustry}
           onChange={(e) => setFilmIndustry(e.target.value)} placeholder="film industry"/>
           
      <input type="text" class="form-control mt-2" value={genre}
           onChange={(e) => setGenre(e.target.value)} placeholder="genre"/>

<input type="text" class="form-control mt-2" value={description}
           onChange={(e) => setDescription(e.target.value)} placeholder="description"/>

           <input type="text" class="form-control mt-2" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="price"/>

<input type="text" class="form-control mt-2" value={ticketsAvailable}
           onChange={(e) => setTicketsAvailable(e.target.value)} placeholder="no of tickets"/>

      <button type="button btn-dark" onClick={()=>props.addmoreTickets(name, image, filmIndustry, genre, description,  price, ticketsAvailable)} class="btn btn-primary mt-2">Add new ticket</button>

  </div>
</form>
    
    
  </div>;
};
