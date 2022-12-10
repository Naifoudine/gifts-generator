import React from "react";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [gender, setGender] = useState("femme");
  const [age, setAge] = useState(23);
  const [hobbies, setHobbies] = useState("dessiner, voyager, coder");
  const [priceMin, setPriceMin] = useState(50);
  const [priceMax, setPriceMax] = useState(500);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
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
    }catch (e){
      alert("La génération des idées de cadeaux a échouée.\n Ressayez plus tard.")
    }finally {
      setLoading(false)
    }
  }

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
            placeholder="Veuillez saisir le prix min."
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          /></div>
            <div className={styles.priceMax}>
          <label htmlFor="priceMax">Prix max. :</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="Veuillez saisir le prix max."
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
      </main>
    </div>
  );
}
