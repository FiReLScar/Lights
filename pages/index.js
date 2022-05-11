import { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

let Index = () => {
  let [color, setColor] = useState("#ff0000")

  useEffect(()=>{
    fetch('api/color').then(res => {res.json().then(data => {setColor(data.color)})})
  },[])

  return <>
    <div className="main">
      <div className="wrapper">
        <HexColorPicker color={color} onChange={setColor}/>
        <button className="set" onClick={()=>{fetch(`api/color?r=${parseInt(color.substring(1, 2), 16)}&g=${parseInt(color.substring(3, 4), 16)}&b=${parseInt(color.substring(5, 6), 16)}`)}}>Set Color</button>
        <button className="off" onClick={()=>{fetch(`api/off`)}}>Turn Off</button>
        <button className="on" onClick={()=>{fetch(`api/on`)}}>Turn On</button>
      </div>
    </div>
    <style jsx>{`
    .main {
      height: 100vh;
      background-color: ${color};
      position: fixed;
      top:0;left:0;right:0;
    }

    .wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100vh;
    }

    .set {
      margin-top: 20px;
    }

    button {
      margin-top: 5px;
      background-color: #fff;
      border: 0;
      font-size: 18px;
      border-radius: 5px;
      padding: 5px 15px;
      width: 200px;
      box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.2)
    }
    `}</style>
  </>
}

export default Index