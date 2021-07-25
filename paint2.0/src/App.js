import React from "react";
import axios from "axios";
import './App.css';

import ColorPicker from './components/ColorPicker.js';
import RangePicker from './components/RangePicker.js';
import GalleryItem from './components/GalleryItem.js';
import CanvasElement from './components/CanvasElement';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      brushColor: '#000',
      backgroundPickerValue: '#000',
      brushSize: 1,
      imgArr: [],
      currentImg: '',
      mousePos: { x: 0, y: 0 }
    };
  }

  componentDidMount() {
    this.getImages();
  }

//input functions

//changing the size of the brush
changeBrushSize = (e) => {
  this.setState({ brushSize: e.target.value });
}

//changing the color of the brush
changeBrushColor = (e) => {
  this.setState({ brushColor: e.target.value });
}

//changing the color of the canvas background
changeBgColor = (e) => {
  this.setState({ backgroundPickerValue: e.target.value });
}

//clearing whats on the canvas and making it available for a new drawing
clearClicked = () => {
  const ctx = this.canvasRef.current.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
};

//loading a new picture to the canvas from the local storage
loadImage = (e) => {
  //https://gist.github.com/felixzapata/3684117
  //https://stackoverflow.com/a/13939150
  const file = e.target.files[0];

  const self = this;
  const fr = new FileReader();
  fr.readAsDataURL(file);
  fr.onload = function (evt) {
    self.drawSelectedImg(evt.target.result);

  }
}
  //server functions

  //saving the images inside the server 
  saveImg = () => {
    //https://github.com/embiem/react-canvas-draw/issues/43#issuecomment-706734669
    //get image from canvas
    const imgSrc = this.canvasRef.current.toDataURL();
    const imgArr = this.state.imgArr;
    imgArr.push(imgSrc)
    const self = this;
    //create req with axios
    axios.post('http://localhost:5050/', {
      imgSrc

    })
      .then(function (response) {
        console.log(response);
        self.setState({ imgArr: imgArr });

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //deleting the images that store in the json file and cleaning the list of images
  deleteAllImages = () => {
    //call server with images and delete all
    const self = this;
    axios.delete('http://localhost:5050/')
      .then(function (response) {
        self.setState({ imgArr: [] });

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  //grabbing the picture from the saved list in the server side
  getImages = () => {
    const self = this;
    axios.get('http://localhost:5050/')
      .then(function (response) {
        const data = response.data.map(d => d.src);
        self.setState({ imgArr: data });

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })}


//canvas functions

//this function is for letting to draw on the canvas when the user loaded a png on top of the canvas
  drawSelectedImg = (imgSrc) => {
    const canvas = this.canvasRef.current;
    const self = this;
    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      self.clearClicked()
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }

  //grabbing the picture from the saved list in the client side back to the canvas
  changeImageInCanvas = (e) => {
    const src = e.target.currentSrc
    console.log(src);
    //add img to state
    this.setState({ currentImg: src });
    //take selected img to canvas
    this.drawSelectedImg(src);
  }

  //control the mouse inside the canvas elements
  onCanvasMove = (pos) => {
    this.setState({ mousePos: pos });
  }


  render() {
    const state = this.state;
    return (
      <div className="App">
        <div id="wrapper">
          <h1>Paint 2.0</h1>
          <div id="toolbar">
            <div>
              <RangePicker
                LabelText='Color'
                pickerValue={state.brushSize}
                minValue="1"
                maxValue="20"
                onInput={this.changeBrushSize} />

              <ColorPicker
                LabelText='Color'
                pickerValue={state.brushColor}
                onInput={this.changeBrushColor} />

              <ColorPicker
                LabelText='Background'
                pickerValue={state.backgroundPickerValue}
                onInput={this.changeBgColor} />
            </div>
            <div>
              <label for="fileLoadBtn">Load image </label> <input id="fileLoadBtn" type="file"
                value="" multiple onChange={this.loadImage} />
              <button id="clearBtn" onClick={this.clearClicked}>Clear</button>
            </div>
          </div>
          <div>
            <CanvasElement 
              innerRef={this.canvasRef}
              onCanvasMove={this.onCanvasMove}
              brushSize={state.brushSize}
              bgColor={state.backgroundPickerValue}
              brushColor={state.brushColor}> </CanvasElement>
          </div>
          <div id="statistics">
            <span id="mousePos">Pos: {`${state.mousePos.x},${state.mousePos.y}`}</span>
            <span id="brushSizeVal">Brush Size: {state.brushSize}</span>
            <span id="brushColorVal">Brush Color: {state.brushColor}</span>
          </div>
          <div id="leftImages">
            <h3>Server</h3>
            <button onClick={this.saveImg}>Save image</button>
            <button onClick={this.deleteAllImages}>Delete All</button>
            <div id="imagesList">
              {state.imgArr.map((element, index) =>
                <GalleryItem
                  key={index}
                  src={element}
                  onSelectImg={this.changeImageInCanvas} />
              )}
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;



