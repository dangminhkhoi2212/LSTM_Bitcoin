import "./App.css";
import { MyChart } from "./components/chart";
import Form from "./components/form";
import { Modal } from "antd";
import { Spin } from "antd";
import useBearStore from "./store";
function App() {
  const predictData = useBearStore((state) => state.predictData);
  const isLoading = useBearStore((state) => state.isLoading);
  const originData = useBearStore((state) => state.originData);
  return (
    <div className="App">
      <div className="bg-[url('./assets/bg.jpg')] min-h-[100vh]  px-10 py-5 flex flex-col justify-center items-center gap-4 ">
        {isLoading && (
          <Modal
            okType="danger"
            title="Đang thực hiện dự đoán dữ liệu"
            open={isLoading}
            confirmLoading={isLoading}
            centered={true}
            onCancel={null}
            footer={null}
          >
            <Spin size="large" />
          </Modal>
        )}

        <Form />
        <MyChart predictData={predictData} originData={originData} />
      </div>
    </div>
  );
}

export default App;
