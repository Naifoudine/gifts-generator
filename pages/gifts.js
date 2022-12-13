import React from "react";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState();
  const [hobbies, setHobbies] = useState("");
  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    const getExpiry = getWithExpiry("myKey") ;
    if ( getExpiry.status === "success"){

      if(loading){
        return;
      }
      setLoading(true);

      try {
        const response = await fetch("/api/generate-gifts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies }),
        });
        const data = await response.json();
        //str.substring(2)
        setResult(data.result.slice(2).replaceAll("\n\n","<br />"));
        console.log("ici :"+ getExpiry.status)

      }catch (e){
        alert("La génération des idées de cadeaux a échouée.\n Ressayez plus tard."+e)
      }finally {
        setLoading(false)
      }
    }else {
      notify()
    }
  }

  const setWithExpiry = (key, value, ttl) => {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
    return {"status":"success"}
  }

  const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key)

    // if the item doesn't exist, return success
    if (!itemStr) {
      setWithExpiry(key, 4, 7200000)
      return {"status":"success"}
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return success
      localStorage.removeItem(key)
      setWithExpiry(key, 4, 7200000)
      return {"status":"success"}
    }

    let request = parseInt(item.value)
    if (typeof request === 'number') {
      if (request > 0) {
        request--
        const newItem = {
          value: request,
          expiry: item.expiry,
        }
        localStorage.setItem(key, JSON.stringify(newItem))
        return {"status":"success"}
      }
      if (request === 0) {
        return {"status":"failed"}
      }
    }

  }
  const notify = () => toast(`Ho ho ho! 
    Vous avez atteint votre quota de demandes pour aujourd\'hui. 👀 
    Ne vous inquiétez pas : vous pouvez réessayer dans 2H ! 😉`, {
    position: "top-right",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    icon: "🎅",
  });

  return (
    <div>
      <Head>
        <title>Générateur de cadeaux de Noël 🎁💡</title>
      </Head>

      <main className={styles.main}>
        <h3>Générateur de cadeaux de Noël 🎁💡</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="gender">Pour qui est le cadeau ?</label>
          <select name="gender"
                  value={gender}
                  onChange={(e)=>setGender(e.target.value)}>
            <option value="homme">Un homme</option>
            <option value="femme">Une femme</option>
          </select>

          <label htmlFor="age">Quel est son age ?</label>
          <input
            type="number"
            min={1}
            max={99}
            name="age"
            placeholder="Veuillez saisir son age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />
          <div className={styles.price}>
            <div className={styles.priceMin}>
          <label htmlFor={priceMin}>Prix min. :</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="0"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          /></div>
            <div className={styles.priceMax}>
          <label htmlFor="priceMax">Prix max. :</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="0"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          /></div>
            </div>
          <label htmlFor="hobbies">Quels sont ses passe-temps préférés ?</label>
          <input
            type="text"
            name="hobbies"
            placeholder="Ex: Cinéma, Musique, Photographie"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
          <input type="submit" value="🎁 Générer les idées de cadeaux 💡" />
        </form>
        {
          loading && (
              <div>
                <h3>Looking for the best gift ideas 🎁 💡</h3>
                <img src="/loading.gif" className={styles.loading}  alt="Loading"/>
              </div>
            )
        }
        {result &&
          (<div className={styles.result}
               dangerouslySetInnerHTML={{__html: "<span>Suggestions d'idées cadeaux :</span>" + result}}/>)
        }
        <ToastContainer
            position="top-right"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            style={{"white-space": "pre-line"}}
        />
      </main>
    </div>
  );
}
