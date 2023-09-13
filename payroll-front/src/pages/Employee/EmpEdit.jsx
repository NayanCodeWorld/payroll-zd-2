import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddEmployee from "./AddEmployee";
import host from "./../utils";
import AuthenticateUser from "../../middleWare/AuthenticateUser";
const Empedit = () => {
  const navigate = useNavigate();

  if (AuthenticateUser()) {
    navigate("/");
  }

  const { id } = useParams();
  const [empdata, empdatachange] = useState();

  useEffect(() => {
    fetch(`${host}/emp/emp_1/` + id)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        // console.log('resp',resp);
        empdatachange(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  useEffect(() => {
    // console.log('empdata',empdata);
  }, [empdata]);
  return empdata ? <AddEmployee data={empdata} /> : <h3>Loading....</h3>;
};

export default Empedit;
