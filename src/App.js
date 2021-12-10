import { useEffect, useRef } from "react";
import "./App.css";
import { ReactComponent as BatteryIcon } from "./assets/items/2.svg";
import { ReactComponent as CircleIcon } from "./assets/items/1.svg";
import { Form, Input } from "antd";

const HorizontalLine = () => {
  return (
    <svg width="50px" height="50px" viewBox="0 0 50 50">
      <path d="M 0 25 L 50 25 " stroke="black" strokeWidth="2" />
    </svg>
  );
};

function App() {
  let SELECTEDITEM;

  const [form] = Form.useForm();

  const itemsRef = useRef();
  const BatteryRef = useRef();
  const CircleRef = useRef();

  const onMouseMove = (event) => {
    // console.log(event, parseInt(SELECTEDITEM.style.width));
    if (SELECTEDITEM) {
      SELECTEDITEM.style.left =
        event.clientX - parseInt(SELECTEDITEM.style.width) / 2;
      SELECTEDITEM.style.top =
        event.clientY - parseInt(SELECTEDITEM.style.height) / 2;
    }
  };

  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mouseup", onMouseUp, false);
  };

  // 移动已放置元件
  const moveSettledItem = (e) => {
    // console.log(e, e.currentTarget);
    SELECTEDITEM = e.currentTarget;
    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mouseup", onMouseUp, false);
  };

  // 鼠标选择item
  const selectItem = (e, index) => {
    let comp;
    switch (index) {
      case 1:
        comp = BatteryRef.current.cloneNode(true);
        break;
      case 2:
        comp = CircleRef.current.cloneNode(true);
        break;
      case 3:
        comp = e.currentTarget.children[0].cloneNode(true);
        break;
      default:
        return alert("ERROR");
    }
    SELECTEDITEM = comp;
    SELECTEDITEM.style.position = "absolute";
    SELECTEDITEM.style.width = "50px";
    SELECTEDITEM.style.height = "50px";
    SELECTEDITEM.setAttribute("class", "settled");
    SELECTEDITEM.onmousedown = moveSettledItem;
    console.log(SELECTEDITEM);
    itemsRef.current.append(SELECTEDITEM);
    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mouseup", onMouseUp, false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    console.log(form);
    // form.resetFields();
    // console.log(form.getFieldsValue());
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  }, []);

  return (
    <div className="App">
      <div className="itemLibrary">
        <div className="itemWrapper" onMouseDown={(e) => selectItem(e, 1)}>
          <BatteryIcon ref={BatteryRef} />
        </div>
        <div className="itemWrapper" onMouseDown={(e) => selectItem(e, 2)}>
          <CircleIcon ref={CircleRef} />
        </div>
        <div className="itemWrapper" onMouseDown={(e) => selectItem(e, 3)}>
          <HorizontalLine />
        </div>
      </div>
      <div className="itemCombanation" ref={itemsRef}>
        <Form form={form} name="dynamic_rule">
          <Form.Item
            name="username"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name",
              },
            ]}
          >
            <Input placeholder="Please input your name" />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="Nickname"
            rules={[
              {
                required: true,
                message: "Please input your nickname",
              },
            ]}
          >
            <Input placeholder="Please input your nickname" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default App;
