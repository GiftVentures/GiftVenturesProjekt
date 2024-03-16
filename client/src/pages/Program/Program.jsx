import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import './Program.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import { jwtDecode } from 'jwt-decode'
import UpdatePrograms from '../../components/UpdatePrograms/UpdatePrograms';

const Program = () => {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const { programId } = useParams();
  const [programData, setProgramData] = useState(null);

  const { user } = useAuthContext()
  const [isAdmin, setAdmin] = useState(false)

  useEffect(() =>{
    if (user){
      const decodedToken=jwtDecode(user.token)
      setAdmin(decodedToken.isAdmin)
      console.log(isAdmin);
    }
  },[user])

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await fetch(`http://localhost:3500/api/program/getProgram/${programId}`);
        if (response.ok) {
          const program = await response.json();
          setProgramData(program);
        } else {
          console.error('Failed to fetch program data');
        }
      } catch (error) {
        console.error('Error fetching program data:', error);
      }
    };

    fetchProgramData();
  }, [programId, editing]);

  const handleDelete = async(id) => {
    const response = await fetch (`http://localhost:3500/api/program/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    })
    if(response.ok){
      navigate("/programs")
    }
  }

  const handleEditButtonClick = () => {
    setEditing(true);
  };

  const handleEditingReset = () => {
    setEditing(false);
  };

  if (editing){
    return(
      <div>
      {programData ? (
        <UpdatePrograms programData={programData} onEditingReset={handleEditingReset} />
      ) : (
        <Loader />
      )}
    </div>
    )
  }

  return (
    <div>
      {programData ? (
        <div>
          <h2>{programData.name}</h2>
          <p>{programData.description}</p>
          <div className="programDetails">
          <img src={programData.img.url} alt="kép a programról" />
              <div>
                <p>Fő: </p>
                <p>
                  {programData.persons.min} - {programData.persons.max}
                </p>
              </div>
              <div>
                <p>Hely:</p>
                <p>
                  {programData.location.county} vármegye, &nbsp;
                  {programData.location.city},&nbsp;
                  {programData.location.address}
                </p>
              </div>
              <div>
                <p>Ár:</p>
                <p>{programData.price} Ft/fő</p>
              </div>
            </div>
            {isAdmin && <button onClick={handleEditButtonClick}>Szerkesztés</button>}
            {isAdmin && <button onClick={()=>handleDelete(programId)}>Törlés</button>}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default Program;
