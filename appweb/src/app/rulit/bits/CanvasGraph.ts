import { ElementRef } from "@angular/core";
import { Graph } from "./Graph";
import { Vertex } from "./Vertex";

export const COLOR_WHITE = "#FFF";
export const COLOR_TRANSPARENT_WHITE = "#F6F6F6";
export const COLOR_GREEN = "#90C14B";
export const COLOR_TRANSPARENT_GREEN = "#BED79A";
export const COLOR_RED = "#E52F2D";
export const COLOR_VIOLET = "#4A4067";
export const COLOR_TRANSPARENT_VIOLET = "#9C97AB";


interface ICanvasGraph {
    draw(): void,
    getNodeAtPosition(clientX: number,clientY: number ): Vertex | undefined,
    flickerNode(newNode: Vertex): void,
    highlightNode(newNode: Vertex): void,
    resetHighlights(): void
}

export class CanvasGraph extends Graph implements ICanvasGraph {

    private _canvas: ElementRef<HTMLCanvasElement>;
    private context: CanvasRenderingContext2D;
    
    constructor(private _nodeRegularImg: HTMLImageElement,
                private _nodeHoverImg: HTMLImageElement,
                private _nodeStartImg: HTMLImageElement,
                private _nodeEndImg: HTMLImageElement ){
        super();
    }

    set canvas(theCanvas: ElementRef<HTMLCanvasElement>){
        this._canvas = theCanvas;
        this.context = this._canvas.nativeElement.getContext("2d");
    }

    // Draws edges first and then nodes
    draw() {

        // Clear canvas
        let canvasRect = this._canvas.nativeElement.getBoundingClientRect();
        this.context.clearRect(0, 0, canvasRect.width, canvasRect.height);

        // Draw edges of each node
        for (const [theNode, edges] of this.adjList.entries()) {
            edges.forEach( connectedNodeId => {
                let connectedNode = this.getNodeById(connectedNodeId);
                this.drawEdgeBetweenNodes(theNode,connectedNode);
            });
        }

        // Draw nodes
        this.nodes.forEach(node => {
            let image = this._nodeRegularImg;
            if (node.isHighlighted || node.isActive) image = this._nodeHoverImg;
            if (node.isFirstNode) image = this._nodeStartImg;
            if (node.isLastNode) image = this._nodeEndImg;
            node.draw(this.context, image);
        });
    }

    private drawEdgeBetweenNodes(theNode: Vertex, connectedNode: Vertex) {
        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.moveTo(theNode.circle.posX, theNode.circle.posY);
        this.context.lineTo(connectedNode.circle.posX,connectedNode.circle.posY);
        if (theNode.isActive && connectedNode.isHighlighted ||
            theNode.isHighlighted && connectedNode.isActive) {
            this.context.strokeStyle = COLOR_VIOLET;
        } 
        else
        {
            this.context.strokeStyle = COLOR_TRANSPARENT_VIOLET;   
        } 
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    }

    // Searchs canvas for a node using event absolute coordinates
    getNodeAtPosition( clientX: number, clientY: number ): Vertex | undefined {
        
        let canvasRect = this._canvas.nativeElement.getBoundingClientRect();

        let thePosition = {
            x: clientX - canvasRect.left,
            y: clientY - canvasRect.top
        }

        let theNode: Vertex;

        this.nodes.forEach( node => {
            if ( node.circle.isPointInside(thePosition) ) theNode = node;
        });

        return theNode ? theNode : undefined;

    }

    // Node flickers in red when incorrect
    flickerNode(newNode: Vertex): void {
        
        let frame = 0;
        this.currentNode.circle.fill = COLOR_WHITE;
        
        const i = setInterval( () => {
            (Math.abs(frame % 2) == 1) ? newNode.circle.fill = COLOR_RED : newNode.resetColor();
            this.draw();
            frame++;
            let requestId = requestAnimationFrame(() => this.flickerNode );

            if (frame >= 5) {
                this.currentNode.resetColor();
                newNode.resetColor();
                this.draw();
                cancelAnimationFrame(requestId);
                clearInterval(i);
            }
        } , 100);
        
    }

    highlightNode(theNode: Vertex): void {
        theNode.isHighlighted = true;
    }

    resetHighlights(): void {
        this.nodes.forEach ( node => { if (node.isHighlighted) node.isHighlighted = false; });
    }

}