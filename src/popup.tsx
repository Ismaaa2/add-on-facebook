import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

interface Base {
  url: string;
  download: boolean;
}

const Popup = () => {
  const [url, setUrl] = useState<Base>({ url: "", download: false });

  useEffect(() => {
    if (url.download) {
      chrome.downloads.download({
        url: url.url,
        filename: `algo.mp4`,
        saveAs: true,
      });
      localStorage.setItem("downloadButton", "false");
      setTimeout(() => {
        setUrl({ download: false, url: "" });
      }, 3000);
    }
  }, [url, setUrl]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    if (url.includes("http")) {
      url = url.replace("www", "m");
      setUrl({ url, download: false });
    } else {
      console.log("url no válida");
    }
  };

  const getLink = () => {
    if (url.url === "") return;
    localStorage.setItem("downloadButton", "true");
    chrome.tabs.create({ url: url.url });
  };

  const getDom = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          const urlDataSet = document.getElementsByClassName(
            "_53mw"
          )[0] as HTMLElement;
          const urlDownload = urlDataSet.dataset.store;
          localStorage.setItem("urlDownload", urlDownload);
          return JSON.parse(urlDownload).src;
        },
      },
      (result: any) => setUrl({ url: result[0].result, download: true })
    );
  };

  return (
    <div
      style={{
        width: "400px",
        height: "200px",
        backgroundColor: "whitesmoke",
        overflow: "unset",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Descarga video facebook</h1>

     { 
      localStorage.getItem("downloadButton") !== "true" &&
     <input
        style={{
          display: "block",
          width: "98%",
          alignContent: "center",
          textAlign: "center",
          margin: "0",
          padding: "0",
          marginBottom: "10px",
          marginTop: "20px",
          backgroundColor: "gray",
          color: "black",
          outline: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        placeholder="URL"
        name="inputUrl"
        type="text"
        onChange={(e) => onChangeInput(e)}
      />}
      {
        localStorage.getItem("downloadButton") !== "true" &&
        <button
        style={{
          width: `${
            localStorage.getItem("downloadButton") === "true" ? "45.6%" : "100%"
          }`,
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "blue",
          color: "white",
          padding: "6px",
          marginRight: "7.5%",
        }}
        onClick={getLink}
      >
        LINK
      </button>
      }
     
      {localStorage.getItem("downloadButton") === "true" && (
        <button
          style={{
            width: `${
              localStorage.getItem("downloadButton") !== "true" ? "45.6%" : "100%"
            }`,
            backgroundColor: "blue",
            color: "white",
            padding: "6px",
          }}
          onClick={getDom}
        >
          DOWNLOAD
        </button>
      )}

      {url.url.includes("http") ? (
        <p
          style={{
            fontSize: "18px",
            color: "red",
            marginTop: "15px",
            fontWeight: "bold",
          }}
        >
          URL cargada correctamente
        </p>
      ) : null}
      {url.download && (
        <p
          style={{
            fontSize: "18px",
            color: "green",
            marginTop: "15px",
            fontWeight: "bold",
          }}
        >
          Descarga realizada correctamente
        </p>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Popup />);
