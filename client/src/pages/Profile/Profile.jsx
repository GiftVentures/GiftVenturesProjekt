import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUserdataContext } from "../../hooks/useUserdataContext";
import UpdateUserdata from "../../components/UpdateUserdata/UpdateUserdata";
import ProgramSaveButton from "../../components/ProgramSaveButton/ProgramSaveButton";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import './Profile.css'

const Profile = () => {
  const { user } = useAuthContext();
  const { userdata, dispatch } = useUserdataContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [savedPrograms, setSavedPrograms] = useState([]);
  const [programs, setPrograms] = useState([]);

  const navigate = useNavigate();

  function Editing() {
    setIsUpdating((prev) => !prev);
  }

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:3500/api/program/get");
        if (response.ok) {
          const programsData = await response.json();
          setPrograms(programsData);
        } else {
          console.error("Failed to fetch programs");
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    if (userdata) {
      setSavedPrograms(userdata.savedPrograms);
    }
  }, [userdata]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3500/api/user/data", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_USERDATA", payload: json });
      }
    };

    if (user) {
      fetchData();
    }
  }, [dispatch, user]);

  const handleProgramSave = async (programId) => {
    console.log(programId);
    const response = await fetch("http://localhost:3500/api/user/update", {
      method: "POST", // Assuming you are sending data as a POST request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ programId }),
    });
  };

  function handleProgramClick(programId) {
    navigate(`/programs/${programId}`);
  }

  return (
    <div>
      {isUpdating ? (
        <div>
          <button onClick={Editing}>Vissza</button>
          <UpdateUserdata />
        </div>
      ) : (
        <div>
          {userdata ? (
            <>
              <div>
                <h2>Profil</h2>
                <table>
                  <tr>
                    <td>Név:</td>
                    <td>{userdata.secondName + " " + userdata.firstName}</td>
                  </tr>
                  <tr>
                    <td>Email-cím:</td>
                    <td>{userdata.email}</td>
                  </tr>
                  <tr>
                    <td>Mobil:</td>
                    <td>{userdata.mobile}</td>
                  </tr>
                  <tr>
                    <td>Születési dátum:</td>
                    <td>{userdata.birthDate}</td>
                  </tr>
                  <tr>
                    <td>Születési hely:</td>
                    <td>{userdata.placeOfBirth}</td>
                  </tr>
                  <tr>
                    <td>Cím:</td>
                    <td>{userdata.address}</td>
                  </tr>
                </table>
                <button onClick={Editing}>Adatok megváltoztatása</button>
              </div>
              <div>
                <h2>Mentett Programjaim</h2>
                <div className="programs">
                  {programs
                    .filter((program) => savedPrograms.includes(program._id))
                    .map((program) => (
                      <div
                        className="program"
                        key={program.id}
                      >
                        {user ? (
                          <ProgramSaveButton
                            savedPrograms={savedPrograms}
                            programId={program._id} // A program azonosítója
                            onProgramSave={(programId) =>
                              handleProgramSave(programId)
                            }
                          />
                        ) : null}
                        <div onClick={() => handleProgramClick(program._id)}>
                          <h3>{program.name}</h3>
                          <img src={program.img.url} alt="kép a programról" />
                          <div className="programDetails">
                            <div>
                              <p>Fő: </p>
                              <p>
                                {program.persons.min} - {program.persons.max}
                              </p>
                            </div>
                            <div>
                              <p>Hely:</p>
                              <p>
                                {program.location.county} vármegye, &nbsp;
                                {program.location.city},&nbsp;
                                {program.location.address}
                              </p>
                            </div>
                            <div>
                              <p>Ár:</p>
                              <p>{program.price} Ft/fő</p>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (<Loader />)}
        </div>
      )}
    </div>
  );
};

export default Profile;
