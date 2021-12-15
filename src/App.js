import { useState, useEffect, useRef } from "react";
import "./App.css";
import { ReactComponent as BatteryIcon } from "./assets/items/2.svg";
import { ReactComponent as CircleIcon } from "./assets/items/1.svg";
import { nanoid } from "nanoid";

function App() {
  const [itemInfoList, setItemInfoList] = useState();

  const itemsRef = useRef();

  let SELECTEDITEM;
  let preX = 0;
  let uuid = 0;
  let direction = "";

  const onMouseMove = (event) => {
    if (SELECTEDITEM) {
      SELECTEDITEM.style.left =
        event.clientX - parseInt(SELECTEDITEM.style.width) / 2;
      SELECTEDITEM.style.top =
        event.clientY - parseInt(SELECTEDITEM.style.height) / 2;
    }
  };

  const itemSettled = (event) => {
    window.removeEventListener("mousemove", onMouseMove, false);
    window.removeEventListener("mouseup", itemSettled, false);
    SELECTEDITEM = null;
  };

  // 移动已放置元件
  const moveSettledItem = (e) => {
    console.log("move", e, e.currentTarget);
    if (e.target && e.target.matches("circle")) return;
    SELECTEDITEM = e.currentTarget;
    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mouseup", itemSettled, false);
  };

  const lineSettled = () => {
    window.removeEventListener("mousemove", movehandler, false);
    window.removeEventListener("mouseup", lineSettled, false);
  }

  const movehandler = (e) => {
    console.log(e.clientX - preX);
    itemInfoList.map((item) => {
      if (item.uuid === uuid) {
        if (direction === "left") {
          item.len = item.len + preX - e.clientX;
          item.x -= preX - e.clientX;
        } else {
          item.len = item.len + e.clientX - preX;
        }
      }
    });
    setItemInfoList([...itemInfoList]);
    preX = e.clientX;
  };

  const resizeLine = (e, id, dir) => {
    preX = e.clientX;
    uuid = id;
    direction = dir;
    window.addEventListener("mousemove", movehandler, false);
    window.addEventListener("mouseup", lineSettled, false);
    e.stopPropagation();
  };

  const HorizontalLine = (props) => {
    return (
      <svg
        // viewBox="0 0 50 50"
        // preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          cursor: "pointer",
          left: props.x,
          top: props.y,
          width: props.len + "px",
          height: "10px",
        }}
        onMouseDown={(e) => {
          moveSettledItem(e);
        }}
      >
        <circle
          cx="5"
          cy="5"
          r="5"
          fill="red"
          style={{ cursor: "e-resize" }}
          onMouseDown={(e) => {
            console.log("down");
            resizeLine(e, props.uuid, "left");
          }}
        ></circle>
        <path d={`M 5 5 L ${props.len - 5} 5`} stroke="black" strokeWidth="2" />
        <circle
          cx={`${props.len - 5}`}
          cy="5"
          r="5"
          fill="red"
          style={{ cursor: "e-resize" }}
          onMouseDown={(e) => resizeLine(e, props.uuid, "right")}
        ></circle>
      </svg>
    );
  };

  const onMouseUp = (event) => {
    let left, top;
    if (SELECTEDITEM) {
      left = event.clientX - parseInt(SELECTEDITEM.style.width) / 2;
      top = event.clientY - parseInt(SELECTEDITEM.style.height) / 2;
      console.log(itemInfoList);
      itemInfoList.push({
        uuid: nanoid(),
        name: SELECTEDITEM.name,
        x: left,
        y: top,
        len: 50,
      });
      setItemInfoList([...itemInfoList]);
      console.log(itemInfoList);
      SELECTEDITEM.remove();
      SELECTEDITEM = null;
    }
    window.removeEventListener("mousemove", onMouseMove, false);
    window.removeEventListener("mouseup", onMouseUp, false);
  };

  // 鼠标选择item
  const selectItem = (e, name) => {
    let comp;
    comp = e.currentTarget.children[0].cloneNode(true);

    SELECTEDITEM = comp;
    SELECTEDITEM.name = name;
    SELECTEDITEM.style.position = "absolute";
    SELECTEDITEM.style.width = "50px";
    SELECTEDITEM.style.height = "50px";
    console.log(
      e.clientX - parseInt(SELECTEDITEM.style.width) / 2,
      e.clientY - parseInt(SELECTEDITEM.style.height) / 2
    );
    SELECTEDITEM.style.left =
      e.clientX - parseInt(SELECTEDITEM.style.width) / 2;
    SELECTEDITEM.style.top =
      e.clientY - parseInt(SELECTEDITEM.style.height) / 2;
    SELECTEDITEM.setAttribute("class", "settled");
    console.log(SELECTEDITEM);
    itemsRef.current.append(SELECTEDITEM);
    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mouseup", onMouseUp, false);
    e.stopPropagation();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let list = [
      {
        uuid: nanoid(),
        name: "battery",
        x: 300,
        y: 300,
      },
      {
        uuid: nanoid(),
        name: "battery",
        x: 600,
        y: 300,
      },
      {
        uuid: nanoid(),
        name: "circle",
        x: 900,
        y: 300,
      },
    ];
    setItemInfoList(list);
  }, []);

  return (
    <div className="App">
      <div className="itemLibrary">
        <div
          className="itemWrapper"
          onMouseDown={(e) => selectItem(e, "battery")}
        >
          <BatteryIcon />
        </div>
        <div
          className="itemWrapper"
          onMouseDown={(e) => selectItem(e, "circle")}
        >
          <CircleIcon />
        </div>
        <div
          className="itemWrapper"
          onMouseDown={(e) => selectItem(e, "horizontalLine")}
        >
          <HorizontalLine len={50} />
        </div>
        
        <div
          className="itemWrapper"
          onMouseDown={(e) => selectItem(e, "battery")}
        >
          <BatteryIcon />
        </div>
        <div
          className="itemWrapper"
          onMouseDown={(e) => selectItem(e, "battery")}
        >
          <BatteryIcon />
        </div>
        <div
          className="itemWrapper"
          onMouseDown={(e) => selectItem(e, "battery")}
        >
          <BatteryIcon />
        </div>
      </div>
      <div className="itemCombanation" ref={itemsRef}>
        {itemInfoList &&
          itemInfoList.map((item, index) => {
            // eslint-disable-next-line default-case
            switch (item.name) {
              case "battery":
                return (
                  <BatteryIcon
                    key={index}
                    style={{
                      position: "absolute",
                      left: item.x,
                      top: item.y,
                      width: "50px",
                      height: "50px",
                    }}
                    onMouseDown={(e) => moveSettledItem(e)}
                  />
                );
              case "circle":
                return (
                  <CircleIcon
                    key={index}
                    style={{
                      position: "absolute",
                      left: item.x,
                      top: item.y,
                      width: "50px",
                      height: "50px",
                    }}
                    onMouseDown={(e) => moveSettledItem(e)}
                  />
                );
              case "horizontalLine":
                return (
                  <HorizontalLine
                    key={index}
                    uuid={item.uuid}
                    x={item.x}
                    y={item.y}
                    len={item.len}
                  />
                );
            }
          })}
      </div>
    </div>
  );
}

export default App;
