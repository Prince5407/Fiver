import React, { useEffect, useRef,useState } from 'react'
import "./Gigs.scss"
import {gigs} from "../../data" 
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from '@tanstack/react-query'; 
import newRequest from '../../utils/newRequest';
import { useLocation } from 'react-router-dom';

const Gigs= () => {

  const [open,setOpen]=useState(false);
  const [sort,setSort]=useState("sales");
  const minRef=useRef();
  const maxRef=useRef();
   //We have used sales here bcoz in backend we are going to make an API request
   // and our query will be this sales
   //We are going to make request like /api/gigs?sort="sales" //this is just example 
  const {search}=useLocation();


   const { isLoading, error, data ,refetch} = useQuery({
    queryKey: ['gigs'],
    queryFn: () =>
    newRequest.get(`/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`)
    .then((res)=>{ //notice you use `` here as we are writing java script query inside it this is a link with queries we are creating

      return res.data;
    })
  });
  //console.log(data);

const reSort=(type)=>{
setSort(type)
setOpen(false)

}
useEffect(()=>{ //refatch whenever sort changes

  refetch();
},[sort]);
const apply = ()=>{
 refetch();
}

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">FIVERR {" > "} GRAPHICS & DESIGN {">"} </span>
        <h1>AI ARTISTS</h1>
        <p>
          Explore the boundary of art and technology with Fiverr's AI artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">SortBy</span>
            <span className="sortType">
              {" "}
              {sort == "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong"
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
};

export default Gigs