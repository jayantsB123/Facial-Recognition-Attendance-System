import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import HeaderPage from './HeaderPage'
import signupic from '../images/Signup.jpg'
const urlserver = "http://localhost:3001"

const SignUp = (props) => {

  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  React.useEffect(() => {
    if (localStorage.getItem("user") === null) {
    } else {
      let user = JSON.parse(localStorage.getItem("user") || "[]");
      props.setLoggedIn(true);
      props.setUserInfo(user);
      navigate(`/Attendy/Home/${user.email}`)
    }
  }, [navigate])

  const createaccount = async () => {
    await axios.post(`${urlserver}/insertuser`, {
      username: name,
      email: username,
      password: password,
      cpassword: cpassword
    })
      .then(
        setTimeout(async () => {
          await axios.get(`${urlserver}/fetchaccount/${username}`)
            .then(async (response) => {
              // console.log(response);
              let userdetail = response.data[0];
              setTimeout(async () => {
                // await axios.post(`https://localhost:3001/user/${userdetail._id}`)
                console.log("User Details:- " ,userdetail);
                localStorage.setItem('user', JSON.stringify(userdetail));
                props.setLoggedIn(true);
                await props.setUserInfo(userdetail);
                console.log("User Info:- " ,props.userInfo);
                setName("");
                setUsername("");
                setPassword("");
                setCpassword("");
                navigate(`/Attendy/Home/${userdetail.email}`)
              }, 1000)
            });
        }, 1000));
  }



  const create = async (e) => {
    e.preventDefault();
    if (!username || !password || !cpassword || !name) {
      alert("Please Ensure that every Field is filled none of it is Empty");
    } else {
      if (password === cpassword) {
        await axios.get(`${urlserver}/fetchaccount/${username}`)
          .then(async (response) => {
            try {
              const tempemail = response.data[0];
              if (tempemail.email === username) {
                alert("Your account already Exists try Signing in to your Account")
                setName("");
                setUsername("");
                setPassword("");
                setCpassword("");
                navigate('/Attendy/SignIn');
              }
            } catch (err) {
              await createaccount();
            }
          })
      } else {
        alert("Password and Confirm Password does not matches please enter password carefully")
      }
    }
  }

  return (
    <>
      <HeaderPage loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} userInfo={props.userInfo} setUserInfo={props.setUserInfo} />
      <div className="Signup">
        <div className="photo"><img src={signupic} className="signupic" /></div>
        <div className="full container">
          <h1>
            Sign-Up
          </h1>
          <br />
          <form onSubmit={create}>
            <div className="mb-3">
              <label for="examplename" className="form-label"><h5>Name</h5></label>
              <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Your Name Here" className="form-control" id="examplename" />
            </div>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label"><h5>Email address</h5></label>
              <input type="email" value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Your Email Here" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label"><h5>Password</h5></label>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder='Enter your Password' className="form-control" id="exampleInputPassword1" />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword2" className="form-label"><h5>Confirm Password</h5></label>
              <input type="password" value={cpassword} onChange={(e) => { setCpassword(e.target.value) }} placeholder='Confirm your Password' className="form-control" id="exampleInputPassword2" />
            </div>
            <br />
            <button type="submit" className="btn btn-lg btnhigh btnlogin">Submit</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp