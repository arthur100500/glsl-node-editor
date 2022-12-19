import React from "react";
import Renderer from "../testing/Renderer/Renderer";
import "./DebugSection.css";

export default function EditorToolbar() {
    return (
        <>
            <div className="debugger">
                <Renderer />
            </div>
        </>
    )
}