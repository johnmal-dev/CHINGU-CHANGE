import classes from "./FormConvert.module.css";
import axios from "axios";
import { useState, useContext } from "react";
import { userCtx } from "../../store/user-ctx";

const FormConvert = () => {
  const userCtxMgr = useContext(userCtx);

  const [userInfo, setUserInfo] = useState({
    amount: 1,
    original: "",
    convertTo: "",
  });
  const [result, setResult] = useState(0);

  const [showSave, setShowSave] = useState(false);

  const inputChangeHandler = (e) => {
    setShowSave(false);
    const { name, value } = e.target;
    setUserInfo((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const convertHandler = async (e) => {
    e.preventDefault();
    console.log(userInfo);

    await axios
      .get(`/api/${userInfo.original}&${userInfo.convertTo}`)
      .then((serverRes) => {
        console.log(serverRes.data);
        let value = Object.values(serverRes.data);
        let mult = value[0] * Number(userInfo.amount);
        setResult(mult.toFixed(2));
        setShowSave(true);
      })
      .catch((err) => {
        console.log(err.response.status);
      });
  };

  const addToListHandler = async (e) => {
    e.preventDefault();
    const objToSend = {
      original: userInfo.original.toUpperCase(),
      convertTo: userInfo.convertTo.toUpperCase(),
      userID: userCtxMgr.user,
    };
    await axios
      .post("/api/saveCurrencies", objToSend)
      .then((serverRes) => {
        userCtxMgr.setList(serverRes.data.currencies);
      })
      .catch((err) => {
        console.log(err);
        // ERROR HANDLER
      });
  };

  return (
    <section className={classes.section}>
      <h2 className={classes.h2}>CONVERT</h2>
      <form className={classes.form}>
        <input
          autoComplete="off"
          name="amount"
          value={userInfo.amount}
          className={classes.input}
          type="number"
          placeholder="AMOUNT"
          onChange={inputChangeHandler}
        />
        <p className={classes.secP}>FROM</p>
        <input
          name="original"
          value={userInfo.original}
          className={classes.input}
          type="text"
          placeholder="CURRENCY"
          onChange={inputChangeHandler}
        />
        <p className={classes.secP}>TO</p>
        <input
          name="convertTo"
          value={userInfo.convertTo}
          className={classes.input}
          type="text"
          placeholder="CURRENCY"
          onChange={inputChangeHandler}
        />
        <div className={classes.btnBox}>
          <input
            onClick={convertHandler}
            className={classes.submit}
            value="Result"
            type="submit"
          />

          <button
            onClick={addToListHandler}
            className={showSave ? classes.submit : classes.disabled}
            disabled={!showSave && true}
            type="submit"
          >
            Add Fav
          </button>
        </div>
      </form>
      <h2 className={classes.h2}>
        TOTAL: <span>{result}</span>
      </h2>
    </section>
  );
};

export default FormConvert;
