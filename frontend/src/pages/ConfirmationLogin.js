import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../helpers/apiLinks";

const ConfirmationLogin = ({ location }) => {
  const { search } = location;
  const confirmationCode = search.split("=")[1];
  
  const [valid, setValid] = useState(false);
  const requestBody = {
    query: `
      mutation{
        verifyUser(confirmationCode:"${confirmationCode}"){
          email
          status
        }
      }
    `,
  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer ",
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201 && res.status !== 403) {
        throw new Error("Failed!");
      }
      setValid(true);
      return res.json();
    })
    .catch((err) => {
      setValid(false);
      throw new Error("Error!", err);
    });

  return (
    <div style={{ margin: "0.75rem 2rem" }}>
      {valid ? (
        <>
          <div className="confirmBox">
            <h2>Account Confirmed!</h2>
          </div>
          <div style={{ margin: "1rem 2rem" }}>
            <Link to="/auth" style={{ color: "blue", textDecoration: "none" }}>
              Please Login
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="confirmBox">
            <h2>PAGE NOT FOUND</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default ConfirmationLogin;
