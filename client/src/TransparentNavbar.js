import { useEffect } from "react"
import { useLocation } from "react-router-dom"


export const TransparentNavbar = () => {
    const location = useLocation(); 

    useEffect(()=>{
       const isMain = document.getElementById('bgvideo')
       let header = document.getElementsByClassName('header');
        if (isMain) {
            header[0].setAttribute('id', 'transparent-header')
        }else {
            header[0].setAttribute('id', 'header')
        }
    },[location])

    return null;

}

