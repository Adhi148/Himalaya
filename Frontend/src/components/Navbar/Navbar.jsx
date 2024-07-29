import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../assets/himalaya_logo.avif";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const [menu , setMenu] = useState('home');
  const navigate = useNavigate();

  const handleHomeClick = ()=>{
    setMenu("home")
    navigate('/');
  };


  const handleGraph = (menu)=>{
    setMenu(menu);

    navigate('/graph');
  }


  const handleAbout = ()=>{
    setMenu("about");
    navigate("/about")
  }

  return (
    <div className="navbar">
      <img src={logo} alt="" className="logo" onClick={handleHomeClick} />
      <ul className="navbar-menu">
        <li onClick={()=>handleHomeClick() } className={menu === 'home'? "active" : ""}>home</li>
        <li onClick={()=>handleGraph("graphs")} className={menu === 'graphs'? "active" : ""}>graphs</li>
        <li onClick={()=>handleAbout()} className={menu === 'about'? "active" : ""}>about</li>
        <li onClick={()=>setMenu("contact_us")} className={menu === 'contact_us'? "active" : ""}>contact us</li>
      </ul>
      <div className="contact">
        <button className="sign_up">Sign Up</button>
        <button className="sign_in">Sign In</button>
      </div>
    </div>
  );
};

export default Navbar;
