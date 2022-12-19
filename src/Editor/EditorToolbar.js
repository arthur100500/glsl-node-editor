import React from "react";
import "./EditorToolbar.css";

const compile = () => { console.log("compile"); }
const save = () => { console.log("save"); }
const saveAsShader = () => { console.log("export"); }

export default function EditorToolbar() {
    return (
        <>
            <div className="toolbar">
                <button className="control-button" onClick={compile}>
                    Compile
                </button>
                <button className="control-button" onClick={save}>
                    Save
                </button>
                <button className="control-button" onClick={saveAsShader}>
                    Export
                </button>
            </div>
        </>
    )
}