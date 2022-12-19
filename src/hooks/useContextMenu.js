import { useEffect, useCallback, useState } from "react";

const useContextMenu = () => {
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false);

    const handleContextMenu = useCallback(
        (event) => {
            event.preventDefault();
            setAnchorPoint({ x: event.pageX, y: event.pageY });
            setShow(true);
        },
        [setShow, setAnchorPoint]
    );

    const getParentElem = (target) => {
        while (target.parentNode) {
            if (target.className === "menu")
                return false;
            target = target.parentNode;
        }
        return true;
    }
    const handleClick = useCallback((event) => { getParentElem(event.target) && show && setShow(false) }, [show]);

    useEffect(() => {
        document.addEventListener("click", handleClick);
        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    });

    return { anchorPoint, show };
};

export default useContextMenu;