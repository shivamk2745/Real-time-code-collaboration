import React, { useEffect, useRef, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import PrimaryButton from "../components/Button";
// import ClientAvatar from "../components/ClientAvatar";
import ConsoleSection from "../components/ConsoleSection";
import EditorComponent from "../components/EditorComponent";
import { useGlobalContext } from "../contexts/GlobalContext";
import { dummyFilesData } from "../helper/data";
import { initSocket } from "../helper/socket";
import { ACTIONS } from "../helper/SocketAction";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAvatar from "../components/LoadingAvatar";

const ClientAvatar = React.lazy(() => import("../components/ClientAvatar"));

const EditorContainer = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [html, setHtml] = useState("<h1>Hello World</h1>");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("console.log('Hello world')");
  const fileNameBarClasses =
    "flex items-center cursor-pointer hover:bg-black justify-start w-full p-2 ";
  const [activeFile, setActiveFile] = useState("index.html");
  const [srcDoc, setSrcDoc] = useState("");
  const socketRef = useRef(null);

  const { name } = useGlobalContext();
  const [clientList, setClients] = useState([]);

  function joinEventhandler({ clients, username, socketId }) {
    setClients(clients);
    if (username !== name) {
      toast.success(`${username} joined the room`);
      socketRef.current?.emit(ACTIONS.SYNC_CODE, {
        socketId,
        html,
        css,
        js,
      });
    }
  }

  function handleErrors(e) {
    console.log("Socket error", e && e?.message);
    toast.error("Socket Connection failed, try again later");
    setTimeout(() => {
      //   router.push("/");
    }, 4000);
  }
  // function videoCall() {
  //   navigate("/video");
  // }
  async function copyRoomId() {
    console.log("From cccc", html, css, js);

    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }
  function leaveRoom() {
    navigate("/");
  }
  useEffect(() => {
    if (!name || name === "") {
      navigate("/");
    }

    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: name ? name : "",
      });

      socketRef.current.on(ACTIONS.JOINED, joinEventhandler);

      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ html, css, js }) => {
        setHtml(html);
        setCss(css);
        setJs(js);
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ username, socketId }) => {
        toast.success(`${username} has left the room`);
        setClients((prev) => prev.filter((c) => c.socketId !== socketId));
      });
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const changeCode = () => {
    setSrcDoc(`
      <html>
        <style>
        ${css}</style>
        <body>${html}</body>
        <script>
        const originalLog = console.log;
        console.log = (...args) => {
          parent.window.postMessage({ type: 'log', args: args }, '*')
          originalLog(...args)
        };
        const originalWarn = console.warn;
        console.warn = (...args) => {
          parent.window.postMessage({ type: 'warn', args: args }, '*')
          originalWarn(...args)
        };
        const originalError= console.error;
        console.error = (...args) => {
          parent.window.postMessage({ type: 'error', args: args }, '*')
          originalError(...args)
        };
        window.onerror = function(msg, url, line){
          parent.window.postMessage({ type: 'error', args: msg, line: line}, '*')
        }
        ${js}</script>
      </html>
    `);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      changeCode();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const getCodeByFileName = (fileName) => {
    let code = "";
    switch (fileName) {
      case "index.html":
        code = html;
        break;
      case "style.css":
        code = css;
        break;
      case "script.js":
        code = js;
        break;
      default:
        break;
    }
    return code;
  };

  const ChangeCodeByFileName = (fileName, value) => {
    switch (fileName) {
      case "index.html":
        setHtml(value);
        break;
      case "style.css":
        setCss(value);
        break;
      case "script.js":
        setJs(value);
        break;
      default:
        break;
    }
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      js: fileName === "script.js" ? value : js,
      css: fileName === "style.css" ? value : css,
      html: fileName === "index.html" ? value : html,
    });
  };

  return (
    <div className="bg-slate-900 px-2 flex text-white">
      {/* <Head>
        <title>Editor | Code Online</title>
      </Head> */}
      <div className="flex-1 grid  grid-cols-[253px,1fr] ">
        <div className="flex flex-col h-screen justify-between">
          <div className=" flex-col">
            <div className="flex items-center px-4 w-full h-32 ">
              <img width={50} height={50} src="/logo-white.png" />
              <h1 className="font-extrabold text-2xl">Code Online</h1>
            </div>
            <hr />
            <div className="flex-col  my-4 w-full ">
              {Object.keys(dummyFilesData).map((keyName, i) => {
                let fileData = dummyFilesData[keyName];

                return (
                  <div
                    key={fileData.language}
                    onClick={() => {
                      setActiveFile(fileData.name);
                    }}
                    className={
                      fileData.name === activeFile
                        ? fileNameBarClasses + "bg-black"
                        : fileNameBarClasses
                    }
                  >
                    {/* <FontAwesomeIcon
                    color={fileData.iconColor}
                    icon={["fab", fileData.iconName as IconName]}
                  /> */}
                    <img width="20px" height="20px" src={fileData.iconName} />
                    <p className="mx-4">{fileData.name}</p>
                  </div>
                );
              })}
            </div>
            <h3 className="mx-3 text-lg font-semibold mb-2">Connected</h3>
            <div className="px-2 w-full flex flex-wrap">
              {clientList.map((client) => (
                <Suspense fallback={<LoadingAvatar />} key={client.socketId}>
                  <ClientAvatar username={client.username} />
                </Suspense>
              ))}
            </div>
          </div>
          <div className="mx-3">
            {/* <button
              onClick={videoCall}
              className="w-full rounded-xl p-3 mb-2 font-bold bg-white text-black"
            >
              Video Call
            </button> */}
            <button
              onClick={copyRoomId}
              className="w-full rounded-xl p-3 mb-2 font-bold bg-white text-black"
            >
              Copy ROOM ID
            </button>
            <button
              onClick={leaveRoom}
              className="w-full rounded-xl p-3 mb-2 font-bold bg-green-500 text-black"
            >
              Leave
            </button>
          </div>
        </div>
        <div style={{ height: "98vh" }} className=" grid grid-cols-2 ">
          <EditorComponent
            onClickFunc={() => {
              changeCode();
            }}
            onChange={(value) => {
              ChangeCodeByFileName(activeFile, value);
            }}
            code={getCodeByFileName(activeFile)}
            language={
              // @ts-ignore
              dummyFilesData[activeFile]?.language
            }
          />
          <div className="grid grid-rows-[65vh_225px]">
            <iframe
              srcDoc={srcDoc}
              className="flex w-full h-full bg-white"
            ></iframe>
            <div className="bg-slate-800">
              <ConsoleSection />
            </div>
          </div>
          {/* // dummyFilesData.find((element) => element.name === activeFile) */}
        </div>
      </div>
    </div>
  );
};

export default EditorContainer;
