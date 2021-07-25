//this component for contorling with the mouse inside the canvas 
import React, { Component } from 'react'

//https://github.com/JacintoDesign/paint-clone
export default class CanvasElement extends Component {
    constructor(props) {
        super(props);
        this.isMouseDown = false;
        this.drawnArray = [];
        this.canvasRef = props.innerRef;
    }
    
    // כדי למלא את צבע הרקע של הקנבאס. 
    componentDidUpdate(prevProps, prevState) {
        //didupdate מוזנקת בכל פעם מחדש כאשר מתבצע שינוי בסטייט או בפרופ
        if (prevProps.bgColor !== this.props.bgColor) {
            const ctx = this.canvasRef.current.getContext('2d');
            ctx.fillStyle = this.props.bgColor;
            //מתחיל מ00 של הקנבאס ולצייר את ריבוע עם צבע
            ctx.fillRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
        }
    }
    //giving the coordinates where the mouse is roaming around the canvas and shows the numbars as intigers
    getMousePosition = (e) => {
        const boundaries = this.canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX -  Math.round(boundaries.left),
            y: e.clientY - Math.round(boundaries.top),
        }; 
    }
  //control the move of the mouse insdie the canvas
    handleMouseMove = (e) => {
        //לשליטה מלאה באוונט
        e.preventDefault();
        const currentPosition = this.getMousePosition(e);
        //לקרוא לפונקציה מהאפ, כדי שתציג את הקורדינטות
        this.props.onCanvasMove(currentPosition);
        if (this.isMouseDown) {
            const ctx = this.canvasRef.current.getContext('2d');
            //לצייר קו על הנקודה הנוכחית
            ctx.lineTo(currentPosition.x , currentPosition.y);
            ctx.stroke();
        }
    };

    handleMouseUp = () => {
        this.isMouseDown = false;
    };

    handleMouseDown = (e) => {
        e.preventDefault();
        this.isMouseDown = true;
        const currentPosition = this.getMousePosition(e);
        const ctx = this.canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(currentPosition.x, currentPosition.y);
        ctx.lineWidth = this.props.brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.brushColor;
    };

//כל קומפוננטה צריכה חהחזיר JSX 
//קטמפוננטת קלאס פועלת לפי פונקצית רנדר
    render() {
        return (
            <canvas
            //https://stackoverflow.com/a/8693791
              style ={{width: "600px" ,height: "400px",
              border: "dashed dimgray 3px",
              cursor: "crosshair"}}
                ref={this.canvasRef}
                //להגיד חקנבאס חהפעיל את הפונקציותצ לפי האוננט שקורא
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
            ></canvas>
        )
    }
}
