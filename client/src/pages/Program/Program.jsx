import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import './Program.css'

const Program = () => {
  const { programId } = useParams();
  const [programData, setProgramData] = useState(null);

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
  }, [programId]);

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
            <button>Szerkesztés</button>
            <button>Törlés</button>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default Program;
