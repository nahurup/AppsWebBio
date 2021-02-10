import { Injectable, NgZone } from "@angular/core";
import { Observable } from "rxjs";
import { CanvasGraph } from "./CanvasGraph";
import { Vertex } from "./Vertex";


@Injectable()
export class TestService {

    // Test Service depends on:
    //      - Graph
    //      - Solution
    //      - NgZone of the component
    //      - User
    constructor(
        private graph: CanvasGraph, 
        private solution: Array<number>, 
        private ngZone: NgZone) {

        // Reverse solutions array to be used as a stack
        this.solution.reverse();

        // Observe when current node changes in order to remove the last element in solutions.
        this.graph.currentNode$.subscribe( () => { 
            this.solution.pop();
        });
        
    }

    // Expose changes in current node.
    get graphCurrentNode$(): Observable<Vertex>{
        return this.graph.currentNode$;
    }

    // Handles user move:
    //      - Searchs for a node in clicked area. (Done)
    //      - Validates that the node is conected with previous one.
    //          . when not "display a error message for 5 - 7 sec."
    //      - Checks if the move is part of the solution.
    //          . when not "selected node flickers in red for X sec."
    //      - Add valid move to users current test
    //      - Update current active node in graph. (Done)
    handleNewMove(clientX: number, clientY: number ): void {
        
        let newNode = this.graph.getNodeAtPosition(clientX,clientY);

        if ( newNode ) {
            if ( ! this.graph.currentNode ) {
                newNode.isFirstNode ? this.graph.currentNode = newNode 
                    : console.log("First move must be start node"); // TBC
            } else {
                if ( this.graph.isCurrentNodeConnectedTo(newNode) ) {
                    if ( this.isSelectedNodeNextInsolution(newNode) ) {
                        this.graph.currentNode = newNode;
                    } else {
                        // Selected node flickers in red
                        this.ngZone.runOutsideAngular( () => { this.graph.flickerNode(newNode); } );
                    }
                } else {
                    // TBC: sums a incorrect decision
                    console.log("Selected node isnt connected"); // TBC "display a error message for 5 - 7 sec."
                }
            }
        }

    }
    
    private isSelectedNodeNextInsolution(theNode: Vertex): boolean {
        // Compare the node to the last element in the array
        return this.solution[this.solution.length - 1] == theNode.id;
    }

    drawGraph(): void {
        this.graph.draw();
    }

}
