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
        filename: "data.mp4",
        saveAs: true,
      });
      setUrl({ download: false, url: "" });
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

  const getLink = () => chrome.tabs.create({ url: url.url });

  const getDom = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.scripting.executeScript(
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

  const getDownload = () => {};

  return (
    <div>
      <h1>Descarga de video facebook</h1>

      <input name="inputUrl" type="text" onChange={(e) => onChangeInput(e)} />

      <button onClick={getLink}>Link</button>
      <button onClick={getDom}>DOM</button>
      <button onClick={getDownload}>Donwload</button>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Popup />);
