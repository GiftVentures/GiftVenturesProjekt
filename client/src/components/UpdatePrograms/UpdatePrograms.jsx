import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import jsonData from "../../data/megyek.json";
import "./UpdatePrograms.css";
const UpdatePrograms = ({ programData, onEditingReset }) => {
  const [existingThemes, setExistingThemes] = useState([]);
  const [chosenThemes, setChosenThemes] = useState([]);
  const [customTheme, setCustomTheme] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [image, setImage] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [price, setPrice] = useState(0);
  const [minPersons, setMinPersons] = useState(0);
  const [maxPersons, setMaxPersons] = useState(0);
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [theme, setTheme] = useState([]);
  const [displayedError, setDisplayedError] = useState(null);
  const [date, setDate] = useState([]);
  const { user } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const [counties, setCounties] = useState([]);
  const [filteredCounties, setFilteredCounties] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    console.log(cities);
  }, [cities]);

  const handleCitySelection = (selectedCity) => {
    setCity(selectedCity);
  };

  useEffect(() => {
    const countyNames = Object.keys(jsonData.megyek);
    setCounties(countyNames);
    setFilteredCounties(countyNames);
  }, []);

  const handleCountySelection = (selectedCounty) => {
    setCounty(selectedCounty);
    setCity("");
    setCities([]); // Új megye kiválasztásakor törlünk minden várost
    const citiesOfSelectedCounty = jsonData.megyek[selectedCounty].telepulesek;
    console.log(citiesOfSelectedCounty);
    setCities(citiesOfSelectedCounty);
    console.log(cities);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3500/api/program/theme", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      // Szűrjük ki azokat a témákat, amelyek még nincsenek hozzáadva a programhoz
      const filteredExistingThemes = json.filter(
        (t) => !programData.theme.includes(t)
      );
      setExistingThemes(filteredExistingThemes);
    };
    if (user) {
      fetchData();
    }
  }, [user, programData]);

  const handleAddDate = () => {
    if (selectedDate && selectedHour) {
      const existingDateIndex = date.findIndex(
        (dateItem) => dateItem.day === selectedDate
      );

      if (existingDateIndex !== -1) {
        const isHourExist =
          date[existingDateIndex].hours.includes(selectedHour);

        if (isHourExist) {
          return;
        }

        const updatedDate = [...date];
        updatedDate[existingDateIndex].hours.push(selectedHour);
        setDate(updatedDate);
      } else {
        setDate([...date, { day: selectedDate, hours: [selectedHour] }]);
      }
    }
  };

  const handleAddTheme = (e) => {
    e.preventDefault();

    if (chosenThemes && !theme.includes(chosenThemes)) {
      const updatedExistingThemes = existingThemes.filter(
        (t) => !chosenThemes.includes(t)
      );
      setTheme([...theme, ...chosenThemes]);
      setExistingThemes(updatedExistingThemes);
      setChosenThemes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setIsUploading(true);
      let uploadedImage = {}; // Tartani fogjuk a feltöltött kép adatait
  
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
  
        const response = await fetch(
          "http://localhost:3500/api/program/img/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            body: formData,
          }
        );
  
        if (response.ok) {
          uploadedImage = await response.json(); // A feltöltött kép adatait itt tároljuk el
        }
      }
  
      const imageData = Object.keys(uploadedImage).length > 0 ? {
        id: uploadedImage.asset_id,
        url: uploadedImage.url,
      } : programData.img; // Ha nincs új feltöltött kép, akkor a régi képet használjuk
  
      const response = await fetch(
        `http://localhost:3500/api/program/update/${programData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            name,
            description,
            img: imageData,
            price,
            persons: { min: minPersons, max: maxPersons },
            location: { county, city, address },
            theme,
            date,
          }),
        }
      );
      console.log(response.json());
    } catch (error) {
      console.error("Error updating program:", error);
    } finally {
      onEditingReset();
    }
  };

  useEffect(() => {
    console.log(imageFile);
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(file);
  };

  const removeTheme = (themeToRemove) => {
    setTheme(theme.filter((t) => t !== themeToRemove));
    setExistingThemes([...existingThemes, themeToRemove]);
  };

  const removeHour = (dateIndexToRemove, hourIndexToRemove) => {
    const updatedDates = [...date];
    updatedDates[dateIndexToRemove].hours.splice(hourIndexToRemove, 1);

    // Ellenőrizzük, hogy az adott dátumhoz tartozó órák tömbje üres-e
    if (updatedDates[dateIndexToRemove].hours.length === 0) {
      // Ha üres, akkor eltávolítjuk az adott dátumot
      updatedDates.splice(dateIndexToRemove, 1);
    }

    setDate(updatedDates);
  };

  useEffect(() => {
    console.log(programData);

    setName(programData.name);
    setDescription(programData.description);
    setPrice(programData.price);
    setMinPersons(programData.persons.min);
    setMaxPersons(programData.persons.max);
    handleCountySelection(programData.location.county);
    handleCitySelection(programData.location.city);
    setAddress(programData.location.address);
    setTheme(programData.theme);
    setPreview(programData.img.url);
    setDate(programData.date);
    setImage(programData.img)
  }, [programData]);

  return (
    <div className="addProgram-container">
      <div className={isUploading ? "loading" : "notLoading"}>
        <h2>Program szerkesztése</h2>
        <form className="addProgram" onSubmit={handleSubmit}>
          <div id="name">
            <label htmlFor="name">Név: &nbsp;</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div id="description">
            <label htmlFor="description">Leírás:</label>
            <textarea
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="img">
            <label htmlFor="img">
              <h3>Kép:</h3>
              {preview && <img src={preview} className="imageUploader"/>}
            </label>
            <input type="file" id="img" onChange={handleImageChange} />
          </div>

          <div id="price">
            <label htmlFor="price">
              <h3>Ár:</h3>
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div id="persons">
            <h3>Személyek:</h3>
            <label htmlFor="min">Min</label>
            <input
              type="number"
              id="min"
              value={minPersons}
              onChange={(e) => setMinPersons(e.target.value)}
            />

            <label htmlFor="max">max</label>
            <input
              type="number"
              id="max"
              value={maxPersons}
              onChange={(e) => setMaxPersons(e.target.value)}
            />
          </div>

          <div id="location">
            <h3>Hely</h3>
            <label htmlFor="county">Vármegye</label>
            <select
              id="county"
              value={county}
              onChange={(e) => handleCountySelection(e.target.value)}
            >
              <option value="" disabled>
                Válassz vármegyét...
              </option>
              {filteredCounties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>

            <label htmlFor="city">Város</label>
            <select
              id="city"
              value={city}
              disabled={!county}
              onChange={(e) => handleCitySelection(e.target.value)}
            >
              <option value="" disabled>
                Válassz várost...
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <label htmlFor="address">Cím</label>
            <input
              disabled={!city}
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div id="themes">
            <label htmlFor="theme">
              <h3>Témák</h3>
            </label>
            <p>Hozzáadott témák:</p>
            <div>
              {theme.map((element, index, array) => (
                <React.Fragment key={index}>
                  <button type="button" onClick={() => removeTheme(element)}>
                    x
                  </button>
                  <span>{element}</span>
                  {index !== array.length - 1 && <span>,&nbsp;</span>}
                </React.Fragment>
              ))}
            </div>
            <select
              id="theme"
              multiple
              value={chosenThemes}
              onChange={(e) =>
                setChosenThemes(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              <option value="" disabled>
                Válassz témát...
              </option>
              {existingThemes.sort().map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="vagy adj meg egy sajátot"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
            />
            <button
              disabled={isUploading}
              type="button"
              onClick={handleAddTheme}
            >
              Téma hozzáadása
            </button>
          </div>

          <div id="date">
            <label htmlFor="day">Nap</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {selectedDate && (
              <>
                <label htmlFor="hours"></label>
                <input
                  type="time"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                />
                <button
                  disabled={isUploading}
                  type="button"
                  onClick={handleAddDate}
                >
                  Időpont hozzáadása
                </button>
              </>
            )}

            <div id="addedHours">
              <p>Időpontok hozzáadva:</p>
              {date.map((dateItem, dateIndex) => (
                <div key={dateItem.day}>
                  <p>
                    {dateItem.day}:&nbsp;
                    {dateItem.hours.map((hour, hourIndex) => (
                      <React.Fragment key={hour}>
                        {hour}
                        <button
                          type="button"
                          onClick={() => removeHour(dateIndex, hourIndex)}
                        >
                          x
                        </button>
                        {hourIndex !== dateItem.hours.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div id="submitButton">
            <button disabled={isUploading} type="submit">
              Szerkesztés befejezése
            </button>
          </div>
        </form>
        {displayedError && <div className="error">{displayedError}</div>}
      </div>
    </div>
  );
};

export default UpdatePrograms;
