import React from "react";
import useContextMenu from "../hooks/useContextMenu";
import "./ContextMenu.css";
import getDefaults from '../nodes/defaultNodeList';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function ContextMenu() {
    const { anchorPoint, show } = useContextMenu();
    const categories = Object.keys(getDefaults());
    const renderedCategories = [];
    let items = [];
    let idx = 0;
    for (var category in categories) {
        items = [];
        for (var nodeFun in categories[category]) {
            items.push(<Dropdown.Item eventKey={"" + nodeFun}>{nodeFun}</Dropdown.Item>);
        }
        renderedCategories.push(<DropdownButton
            id={`dropdown-button-drop-${idx++}`}
            size="sm"
            variant="secondary"
            title={category}
        >{items}</DropdownButton>);
    }
    if (show) {
        return (
            <>
                <div className="menu" style={{ top: anchorPoint.y, left: anchorPoint.x }}>
                    <p>(+) Add Node</p>
                    {renderedCategories}
                </div>
            </>
        )
    }
    return <></>;
}